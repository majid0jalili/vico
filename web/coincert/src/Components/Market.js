import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import { WidgetLoader, Widget } from "react-cloudinary-upload-widget";

class Market extends Component {
  constructor(props) {
    super(props);
    // This binding is necessary to make `this` work in the callback
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete(e) {
    e.preventDefault();
    console.log("The link was clicked.");
  }

  render() {
    return (
      <>
        <WidgetLoader />
        <Widget
          // sources={['local', 'camera']}
          // resourceType={'auto'} // optionally set with 'auto', 'image', 'video' or 'raw' -> default = 'auto'
          // cloudName={'goatagency'} // your cloudinary account cloud name. Located on https://cloudinary.com/console/
          // uploadPreset={'preset1'} // check that an upload preset exists and check mode is signed or unisgned
          // buttonText={'Open'} // default 'Upload Files'
          // style={null} // inline styling only or style id='cloudinary_upload_button'
          // generateSignatureUrl={
          //   'http://localhost:3000/api/v1/contents/generate_signature'
          // } // e.g. 'http://my_domain.com/api/v1/media/generate_signature' -> check cloudinary docs for signing uploads
          // // apiKey={'???????????'} // cloudinary API key -> number format
          // // // folder // set cloudinary folder name to send file
          // // cropping={false} // set ability to crop images -> default = true
          // // onSuccess // add success callback -> returns result
          // // onFailure // add failure callback -> returns 'response.error' + 'response.result'
          // // logging={false} // default = true
          // // imageName // set a specific image name
          // // eager // e.g. 'w_400,h_300,c_pad|w_260,h_200,c_crop'
          // // accepts // for signed uploads only -> default = 'application/json'
          // // contentType // for signed uploads only -> default = 'application/json'
          // // withCredentials // default = true -> check axios documentation for more information
          // // use_filename // tell Cloudinary to use the original name of the uploaded file as its public ID -> default = true,
          // // unique_filename // setting it to false, you can tell Cloudinary not to attempt to make the Public ID unique, and just use the normalized file name -> default = true
          sources={["local"]}
          cloudName={"ut-austin"}
          uploadPreset={"eff9hf99"}
          buttonText={"Open"}
          style={{
            color: "white",
            border: "none",
            width: "240px",
            height: "120px",
            backgroundColor: "green",
            borderRadius: "4px",
          }}
          onSuccess={(res) => console.log("Majid Suc " + res)}
          onFailure={(res) => console.log("Majid Fail " + res)}
          logging={true}
          generateSignatureUrl={""}
          apiKey={"116582632872948"}
          accepts={"application/json"}
          contentType={"application/json"}
          withCredentials={true}
          unique_filename={true}
          resourceType={"image"}
        />
      </>
    );
  }
}
export default Market;
