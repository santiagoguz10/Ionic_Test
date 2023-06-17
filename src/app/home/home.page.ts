import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DomSanitizer } from '@angular/platform-browser';
import { Geolocation } from '@capacitor/geolocation';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  imageSource:any;
  coords: any;
  photo : any;
  coordenadasLatitud: any;
  coordenadasLongitud: any;
  geoAddress:any;
  options: NativeGeocoderOptions = {
    useLocale : true,
    maxResults: 5
  }

  constructor(private domSanitizer:DomSanitizer, private nativeGeo : NativeGeocoder) {}

  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      //resultType: CameraResultType.Base64
      resultType : CameraResultType.Uri,
      source : CameraSource.Prompt,
      //source: CameraSource.Photos,
      saveToGallery: true
    });
    if(image){
      this.photo = true;
    }

    //this.imageSource = 'data:image/jpeg;base64,' + image.base64String;

    this.imageSource = this.domSanitizer.bypassSecurityTrustUrl(image.webPath ? image.webPath: "");

     image.webPath;

  };

  getPhoto(){
    return this.imageSource;
  }

  async fetchLocation(){
    const location = await Geolocation.getCurrentPosition();

    if(location){
      this.coords = true;
    }
    this.coordenadasLongitud = location.coords.longitude;
    this.coordenadasLatitud = location.coords.latitude;

    //this.nativeGeo.reverseGeocode(location.coords.latitude, location.coords.longitude, this.options).then((
    //  result: NativeGeocoderResult[])=>{
    //
    //    this.geoAddress = this.generateAddress(result[0]);
//
    //    console.log(result);
    //  }
    //)
  }

  generateAddress(addressObj:any){
    let obj : any;
    let uniqueNames :any;
    let address = "";
    for(let key in addressObj){
      if(key != 'areasOfInterest'){
        obj.push(addressObj[key]);
      }
    }
    var i=0;
    obj.forEach(()=>{
      if(uniqueNames.indexOf(obj[i]) === -1 ){
        uniqueNames.push(obj[i]);
      }
      i++;
    });

    uniqueNames.reverse();
    for(let val in uniqueNames){
    if(uniqueNames[val].length){
      address += uniqueNames[val]+',';
    }

    }
    return address.slice(0,-2);
  }

}

