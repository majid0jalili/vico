pragma solidity ^0.5.1;

import "@openzeppelin/contracts/token/ERC721/ERC721MetadataMintable.sol";
import "@openzeppelin/upgrades/contracts/upgradeability/AdminUpgradeabilityProxy.sol";

contract MarketStorage {

    struct User {
        bool valid;
        string id;
        address addr;
        uint256[] tokens;
        ContactInfo contact;
    }

    struct ContactInfo{
        string email;
        string phone;
    }

    struct IndexValue { uint keyIndex; User value; }
    struct KeyFlag { address key; bool deleted; }

    struct PlatformStruct {
        uint userCnt;
        mapping(address => User) users;
        mapping (uint256 => address) tokenOwner;
        uint256[] tokens;
        mapping (uint256 => uint256) tokenPrice;
        mapping (uint256 => string) tokenUrl;
    }

    PlatformStruct platform;
}

contract MarketProxy is ERC721MetadataMintable, AdminUpgradeabilityProxy, MarketStorage {

    constructor (address _logic, address _admin, bytes memory _data) ERC721Metadata("PlasticCoin", "PLC") ERC721() AdminUpgradeabilityProxy(_logic, _admin, _data) public {
        // platform.minterGranter = msg.sender;
    }

    // TODO: Define events and integrate with the application.
    // event mintedToken(address to, uint256 tokenId, string tokenURI);
    // event dummyEvent(uint);

    // TODO: Links with the large TODO at the start of this contract. Find a better method to avoid clumsy overriding of all methods in ERC721MetadataMintable.
    function mintWithTokenURI(uint256 capacity, uint256 tokenId, string memory tokenURI) public returns (bool) {
        _fallback();
    }

    // Things tested -
    // 1. Even if mintWithTokenURI above doesn't have the onlyMinter modifier, the modifier in the called function in the implementation will take care of that. So, don't keep any
    // modifiers in this contract's function at all.
    //
    // 2. The modifiers called after a delegate to the implementation's function is done, are those of the implementation itself. This was tested by overriding onlyMinter modifier in this
    // contract to never fail, but we were still not able to mint tokens using a non-minter account.

    // TODO: Redirect the addMinter function.
    // function addMinter(address account) public {
    //     // _fallback();
    // }

    // TODO: Override the below function to allow fallback and then delegate even if the call is made by the admin. Make a choice on this later (decide on the user dynamics and then
    // change this function). Also, note that the super has also been commneted out, which is not a good pratice?
    function _willFallback() internal {
        // super._willFallback();
    }

    // TODO: Allow the implementation contract to override BaseAdminUpgradeabilityProxy to allow voting etc.

}

contract TradeProxy is ERC721MetadataMintable, EventStorage {

    constructor () ERC721Metadata("PlasticCoin", "PLC") ERC721() public {
    }

    function insertUser(address key, ContactInfo memory value) internal returns (bool replaced) {
        bool  userExist= platform.users[key].valid;

        if (userExist)
            return true;

        platform.users[key].contact = value;
        platform.users[key].addr = key;
        platform.users[key].valid = 1;
        platform.users[key].id = userCnt;
        userCnt = UserCnt+1;
        return false;
    }

    function containsUser(address key) internal view returns (bool) {
        return platform.users[key].valid;
    }

    function mintWithTokenURI(uint256 capacity, uint256 tokenId, string memory tokenURI, uint256 price) public returns (bool) {
        require(!_exists(tokenId), "Token already exists");
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        platform.tokenOwner[tokenId] = msg.sender;
        platform.users[msg.sender].tokens.push(tokenId);
        platform.tokenPrice[tokenId] = price;
        platform.tokens.push(tokenId);
        return true;
    }

    function purchaseToken(uint256 tokenId, uint256 share) public {
        if (share!=1) {
            return;
        }

        address prevOwner = platform.tokenOwner[tokenId];
        platform.tokenOwner[tokenId] = msg.sender;
        users[msg.sender].tokens.push(tokenId);
        for (uint i = index; i<platform.users[prevOwner].tokens.length-1; i++){
            if(platform.users[prevOwner].tokens[i]==tokenId){
                delete array[i];
                return;
            }
        }
    }

    function transferShareFrom(address to, uint256 tokenId, uint share) public {
        require(platform.tokenOwnersShares[tokenId][_msgSender()] >= share, "Cannot share more than owner's share");
        require(to != address(0), "Cannot transfer to the zero address");
        if (share!=1) {
            return;
        }
        address prevOwner = platform.tokenOwner[tokenId];
        platform.tokenOwner[tokenId] = to;
        users[to].tokens.push(tokenId);
        for (uint i = index; i<platform.users[prevOwner].tokens.length-1; i++){
            if(platform.users[prevOwner].tokens[i]==tokenId){
                delete array[i];
                return;
            }
        }
    }

    function getTokenOwners(uint256 tokenId) public view returns (address[] memory) {
        address[] memory ret;
        if(platform.tokenOwners[tokenId]!=0){
            ret.push(platform.tokenOwners[tokenId]);
        }
        return ret;
    }

    function isAccountTokenOwner(uint256 tokenId) public view returns (bool) {
        return msg.sender == tokenOwner[tokenId];
    }

    function getTokenIds() public view returns (uint256[] memory) {
        return platform.tokens;
    }

    function getTokenShare(uint256 tokenId, address owner_address) public view returns (uint) {
        if(platform.tokenOwner[tokenId]==owner_address){
            return 1;
        }
        else {
            return 0;
        }
    }

    function getOwnerTokens(address owner) public view returns (uint256[] memory) {
        return platform.users[owner].tokens;
    }

    event addedUser(address user_address);
    function insertUserDetails(string memory email, string memory phone) public {
        require(containsUser(_msgSender()) == false, "The user details already exist.");
        insertUser(_msgSender(), ContactInfo({email: email, phone: phone}));
        emit addedUser(_msgSender());
    }

    function getUserDetails(address key) public view returns (string memory, string memory) {
        return (platform.users[key].contact.email, platform.users[key].contact.phone);
    }

    function setURL(uint256 tokenId, string memory resourceURL) public returns (bool){
        require(_msgSender()==ownerOf(tokenId));
        platform.tokenUrl[tokenId] = resourceURL;
        return true;
    }

    function getURL(uint256 tokenId) public view returns (string memory) {
        return platform.tokenUrl[tokenId];
    }

}
