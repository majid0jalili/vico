import React from "react";
import ReactDOM from "react-dom";
import Form from "react-bootstrap/Form";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { CloudinaryContext, Transformation, Image } from "cloudinary-react";
import axios from "axios";

import Web3 from "web3";
import {
  EVENT_CONTRACT_ABI,
  EVENT_CONTRACT_ADDRESS,
} from "../Middleware/SmartContractABI.js";

const PREFIX_URL =
  "https://raw.githubusercontent.com/xiaolin/react-image-gallery/master/static/";

const PREFIX_URL2 = "https://res.cloudinary.com/ut-austin/image/upload/";

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
      event_name: "Event122",
      event_capacity: 10,
      createdEventID: "1231231",
      date: "04/04/2022",
      start_time: "10:10PM",
      end_time: "10:20PM",
      gallery: [],
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
    ].concat(this._getStaticImages());
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

  componentDidMount() {
    console.log("********** componentDidMount");
    this.loadBlockchainData();
    axios
      .get("https://res.cloudinary.com/ut-austin/image/list/aaa.json")
      .then((res) => {
        console.log("res.data.resources ", res.data.resources);

        this.setState({ gallery: res.data.resources });
        console.log("this.state.gallery ", this.state.gallery);
        console.log("this.state.gallery ", this.state.gallery.length);
      });
  }

  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    const contract = await new web3.eth.Contract(
      EVENT_CONTRACT_ABI,
      EVENT_CONTRACT_ADDRESS,
      { from: account, gas: 2300000, gasPrice: "20000000000" }
    );
    //const events = await web3.eth.get
    this.setState({ account: account, web3: web3, contract: contract });
  }

  contractCreateEvent(event) {
    console.log("Gallery Submit started", this.state.event_price);
    this.enableMetamask();
    let token_uri = {
      event_name: this.state.event_name,
      price: this.state.event_price,
      date: this.state.date,
      start_time: this.state.start_time,
      end_time: this.state.end_time,
      version: 1,
    };
    let capacity = 5;
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
    ///Let's remove the picture
    let idx = this._imageGallery.getCurrentIndex();
    var array = [...this.state.gallery];
    if (idx !== -1) {
      array.splice(idx, 1);
      this.setState({ gallery: array });
    }
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
    for (let i = 0; i < this.state.gallery.length; i++) {
      console.log(
        "Gallery _getStaticImages ",
        i,
        this.state.gallery[i].public_id
      );
      images.push({
        original: `${PREFIX_URL2}${this.state.gallery[i].public_id}.jpg`,
        thumbnail: `${PREFIX_URL2}${this.state.gallery[i].public_id}.jpg`,
      });
    }
    console.log("images _getStaticImages ", images);
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
    console.log("Gallery handlePriceChange");
    this.setState({ event_price: event.target.value });
  }

  render() {
    console.log("Images before", this.images);
    this.images = this._getStaticImages();
    console.log("Images after", this.images);
    return (
      <Form onSubmit={this.contractCreateEvent}>
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
          ,
          <Form.Control type="submit" value="Submit" />
          <h1>{this.state.createdEventID}</h1>
        </section>
      </Form> /*,
      (
        <div className="main">
          <h1>Galleria</h1>
          <div className="gallery">
            <CloudinaryContext cloudName="ut-austin">
              {this.state.gallery.map((data) => {
                return (
                  <div className="responsive" key={data.public_id}>
                    <div className="img">
                      <a
                        target="_blank"
                        href={`https://res.cloudinary.com/ut-austin/image/upload/${data.public_id}.jpg`}
                      >
                        <Image publicId={data.public_id}>
                          <Transformation
                            crop="scale"
                            width="300"
                            height="200"
                            dpr="auto"
                            responsive_placeholder="blank"
                          />
                        </Image>
                      </a>
                      <div className="desc">Created at {data.created_at}</div>
                    </div>
                  </div>
                );
              })}
            </CloudinaryContext>
          </div>
        </div>
      )*/
    );
  }
}

export default Gallery;
