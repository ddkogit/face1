import React from 'react';
import './App.css';
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";






    
///////////////////////////////////////////////////////////////////////////////////////////////////
// In this section, we set the user authentication, user and app ID, model details, and the URL
// of the image we want as an input. Change these strings to run your own example.
//////////////////////////////////////////////////////////////////////////////////////////////////

const returnClarifaiJSONRequest =(imageUrl)=>{
  const PAT = 'cae8f7c479874b969870ea368bf33a13';
  // Specify the correct user_id/app_id pairings
  // Since you're making inferences outside your app's scope
  const USER_ID = 'dpes';       
  const APP_ID = 'faceapp1';
  // Change these to whatever model and image URL you want to use
  const MODEL_ID = 'face-detection';
  // const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';    
  const IMAGE_URL = imageUrl;

  const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                }
            }
        }
    ]
});

  
 const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
};
return requestOptions;
}



class App extends React.Component{
  constructor(){
    super();
    this.state={
      input:"",
      imageUrl:"",
      box:{},
      route:"signin",
      isSignedIn:false,
    }
  }


  

  calculateFaceLocation =(data)=>{
    
     const clarifaiFace =data.outputs[0].data.regions[0].region_info.bounding_box;
     const image = document.getElementById("inputimage");
      const width = Number(image.width);
      const height = Number(image.height);
      return {
      


        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)

      }
  }

  displayFaceBox =(box)=>{
   ;
    this.setState({box:box});
  }

  onInputChange =(event)=>{
    this.setState({input:event.target.value})
      
  }

  onButtonSubmit=()=>{

   

    this.setState({imageUrl:this.state.input})

    fetch("https://api.clarifai.com/v2/models/" + "face-detection" + "/outputs", returnClarifaiJSONRequest(this.state.input))
    .then(response => response.json())
    .then(result => this.displayFaceBox(this.calculateFaceLocation(result)))
    
    .catch(error => console.log('error', error));

    


   

  }

  onRouteChange=(route)=>{
    if(route === "signout"){
      this.setState({isSignedIn:false})
    }
    else  if(route === "home"){
      this.setState({isSignedIn:true})
    }
   
      this.setState({route:route});

    


  }



 
render(){

  const {isSignedIn,route,box, imageUrl} = this.state;
  
  return (
    
      <div className="App">
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {route==="home" ?
       
       <div>
          <Logo />
          <Rank />
          <ImageLinkForm onInputChange =
          {this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}/>
          <FaceRecognition box={box} imageUrl={imageUrl} />
        </div>
        :(
          route ==="signin"?
          <Signin onRouteChange={this.onRouteChange} />:
          <Register onRouteChange={this.onRouteChange} />
        )
         }
      
    </div>
  );
}
}

export default App;
