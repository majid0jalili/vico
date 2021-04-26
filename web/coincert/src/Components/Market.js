import React, {Component} from 'react';
import ImageUploader from 'react-images-upload';
 

class Market extends Component {
  constructor(props) {
    super(props);
     this.state = { pictures: [] };
     this.onDrop = this.onDrop.bind(this);
  }

  onDrop(picture) {
    console.log("Here", picture);

    this.setState({
        pictures: this.state.pictures.concat(picture),
    });


  }



  render() {
    return (
        <ImageUploader
            withIcon={true}
            buttonText='Choose images'
            onChange={this.onDrop}
            imgExtension={['.jpg', '.gif', '.png', '.gif']}
            maxFileSize={5242880}
        />,
        <img src={this.state.pictures[0]} />

        
    );
  } 


}
export default Market;
