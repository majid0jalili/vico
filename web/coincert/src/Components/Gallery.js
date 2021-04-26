import React from "react";
import ReactDOM from "react-dom";
import Form from "react-bootstrap/Form";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import Web3 from "web3";
import {
  EVENT_CONTRACT_ABI,
  EVENT_CONTRACT_ADDRESS,
} from "../Middleware/SmartContractABI.js";

const PREFIX_URL =
  "https://raw.githubusercontent.com/xiaolin/react-image-gallery/master/static/";

class Gallery extends React.Component {
  constructor() {
    super();
    this.state = {
      showIndex: false,
      showBullets: true,
      infinite: true,
      showThumbnails: true,
      showFullscreenButton: true,
      showGalleryFullscreenButton: true,
      showPlayButton: true,
      showGalleryPlayButton: true,
      showNav: true,
      isRTL: false,
      slideDuration: 450,
      slideInterval: 2000,
      slideOnThumbnailOver: false,
      thumbnailPosition: "bottom",
      showVideo: {},
      useWindowKeyDown: true,
      event_price: 1,
      account: null,
      web3: null,
      contract: null,
    };
    //Majid
    this.images = [
      {
        thumbnail: `${PREFIX_URL}4v.jpg`,
        original: `${PREFIX_URL}4v.jpg`,
        embedUrl:
          "https://www.youtube.com/embed/4pSzhZ76GdM?autoplay=1&showinfo=0",
        description: "This is art from Majid for 20 ETH",
        renderItem: this._renderVideo.bind(this),
      },

      {
        original: `${PREFIX_URL}1.jpg`,
        thumbnail: `${PREFIX_URL}1t.jpg`,
        originalClass: "featured-slide",
        thumbnailClass: "featured-thumb",
        description: "This is for 100ETH",
      },
    ];
    //.concat(this._getStaticImages());
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.contractCreateEvent = this.contractCreateEvent.bind(this);
  }
  enableMetamask = () => {
    window.ethereum.enable();
  };

  getTokenID(token_uri) {
    return this.state.web3.utils.soliditySha3(token_uri);
    //return int.from_bytes(sha3.keccak_256(token_uri.encode('utf-8')).digest(), byteorder="big", signed=False)
  }

  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    const contract = await new web3.eth.Contract(
      EVENT_CONTRACT_ABI,
      EVENT_CONTRACT_ADDRESS,
      { from: account, gas: 1500000, gasPrice: "20000000000" }
    );
    //const events = await web3.eth.get
    this.setState({ account: account, web3: web3, contract: contract });
  }

  contractCreateEvent(event) {
    this.enableMetamask();
    let token_uri = {
      price: this.state.event_price,
      version: 1,
    };
    let capacity = this.state.event_capacity;
    token_uri["event_creator"] = this.state.account;
    console.log("createEvent");
    let tokenID = this.getTokenID(token_uri);
    try {
      this.state.contract.methods
        .mintWithTokenURI(
          capacity,
          tokenID,
          JSON.stringify(token_uri),
          this.state.event_price
        )
        .send({ from: this.state.account })
        .on(
          "transactionHash",
          function (hash) {
            console.log("TransactionHash " + hash);
            this.setState({
              createdEventID: "Created Event TokenID: " + tokenID,
            });
          }.bind(this)
        )
        .on("receipt", function (receipt) {
          console.log("Receipt " + JSON.stringify(receipt));
        })
        .on("confirmation", function (confirmationNumber, receipt) {
          console.log("Confirmation Number " + confirmationNumber);
        })
        .on("error", console.error);
    } catch (error) {
      console.log("Error" + error);
    }
    event.preventDefault();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.slideInterval !== prevState.slideInterval ||
      this.state.slideDuration !== prevState.slideDuration
    ) {
      // refresh setInterval
      this._imageGallery.pause();
      this._imageGallery.play();
    }
  }

  _onImageClick(event) {
    console.debug(
      "clicked on image",
      event.target,
      "at index",
      this._imageGallery.getCurrentIndex()
    );
  }

  _onImageLoad(event) {
    console.debug("loaded image", event.target.src);
  }

  _onSlide(index) {
    this._resetVideo();
    console.debug("slid to index", index);
  }

  _onPause(index) {
    console.debug("paused on index", index);
  }

  _onScreenChange(fullScreenElement) {
    console.debug("isFullScreen?", !!fullScreenElement);
  }

  _onPlay(index) {
    console.debug("playing from index", index);
  }

  _handleInputChange(state, event) {
    this.setState({ [state]: event.target.value });
  }

  _handleCheckboxChange(state, event) {
    this.setState({ [state]: event.target.checked });
  }

  _handleThumbnailPositionChange(event) {
    this.setState({ thumbnailPosition: event.target.value });
  }

  _getStaticImages() {
    let images = [];
    for (let i = 2; i < 4; i++) {
      images.push({
        original: `${PREFIX_URL}${i}.jpg`,
        thumbnail: `${PREFIX_URL}${i}t.jpg`,
      });
    }

    return images;
  }

  _resetVideo() {
    this.setState({ showVideo: {} });

    if (this.state.showPlayButton) {
      this.setState({ showGalleryPlayButton: true });
    }

    if (this.state.showFullscreenButton) {
      this.setState({ showGalleryFullscreenButton: true });
    }
  }

  _toggleShowVideo(url) {
    this.state.showVideo[url] = !Boolean(this.state.showVideo[url]);
    this.setState({
      showVideo: this.state.showVideo,
    });

    if (this.state.showVideo[url]) {
      if (this.state.showPlayButton) {
        this.setState({ showGalleryPlayButton: false });
      }

      if (this.state.showFullscreenButton) {
        this.setState({ showGalleryFullscreenButton: false });
      }
    }
  }

  _renderVideo(item) {
    return (
      <div>
        {this.state.showVideo[item.embedUrl] ? (
          <div className="video-wrapper">
            <a
              className="close-video"
              onClick={this._toggleShowVideo.bind(this, item.embedUrl)}
            ></a>
            <iframe
              width="560"
              height="315"
              src={item.embedUrl}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <a onClick={this._toggleShowVideo.bind(this, item.embedUrl)}>
            <div className="play-button"></div>
            <img className="image-gallery-image" src={item.original} />
            {item.description && (
              <span
                className="image-gallery-description"
                style={{ right: "0", left: "initial" }}
              >
                {item.description}
              </span>
            )}
          </a>
        )}
      </div>
    );
  }

  handlePriceChange(event) {
    this.setState({ event_price: event.target.value });
  }

  render() {
    return (
      <section className="app">
        <ImageGallery
          ref={(i) => (this._imageGallery = i)}
          items={this.images}
          lazyLoad={false}
          onClick={this._onImageClick.bind(this)}
          onImageLoad={this._onImageLoad}
          onSlide={this._onSlide.bind(this)}
          onPause={this._onPause.bind(this)}
          onScreenChange={this._onScreenChange.bind(this)}
          onPlay={this._onPlay.bind(this)}
          infinite={this.state.infinite}
          showBullets={this.state.showBullets}
          showFullscreenButton={
            this.state.showFullscreenButton &&
            this.state.showGalleryFullscreenButton
          }
          showPlayButton={
            this.state.showPlayButton && this.state.showGalleryPlayButton
          }
          showThumbnails={this.state.showThumbnails}
          showIndex={this.state.showIndex}
          showNav={this.state.showNav}
          isRTL={this.state.isRTL}
          thumbnailPosition={this.state.thumbnailPosition}
          slideDuration={parseInt(this.state.slideDuration)}
          slideInterval={parseInt(this.state.slideInterval)}
          slideOnThumbnailOver={this.state.slideOnThumbnailOver}
          additionalClass="app-image-gallery"
          useWindowKeyDown={this.state.useWindowKeyDown}
        />
        <Form onSubmit={this.contractCreateEvent}></Form>
        <Form.Label>
          Price (in ETH):
          <Form.Control
            type="number"
            value={this.state.event_price}
            onChange={this.handlePriceChange}
          />
        </Form.Label>
        <Form.Control type="submit" value="Submit" />
        <h1>{this.state.createdEventID}</h1>
      </section>
    );
  }
}

export default Gallery;
