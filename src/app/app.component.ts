import { Component, OnInit, AfterViewInit } from '@angular/core';
import { createWorker, PSM } from 'tesseract.js';
import { TextSegement } from './TextSegement';


declare const Buffer;

declare const MarvinImage: any;
declare var Marvin: any;



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'Angular-OCR-Test';


  ocrResult = 'Recognizing...';
  constructor() {    
    
    //this.doOCR();     
  }
  ngAfterViewInit(): void {
    this.findText();
  }


  findText() {
    var canvas1: HTMLElement = document.getElementById("canvas_1");
    var imageUrl: string = 'assets/container.jpg';
    //var imageUrl: string = 'assets/findtext.jpg';

    // Canvas and Images 
    // Load Road image 
    var imageRoad = new MarvinImage(); 
    imageRoad.load(imageUrl, imageRoadLoaded);

    // Find Text regions in the road image 
    async function imageRoadLoaded(){ 

      // var imageScaled = new MarvinImage();
      
      //"maxWhiteSpace", 10);
      //"maxFontLineWidth", 10);
      //"minTextWidth", 30);
      //"grayScaleThreshold", 127);

      // let Marvinj find Text Regions in your picture
      //var segments = Marvin.findTextRegions(imageRoad, 10, 30, 300, 200);
      //var segments = Marvin.findTextRegions(imageRoad, 10, 20, 70, 200); 

      //save these segments in a typescript model
      // for (var i in segments) {
      //   var seg = segments[i];
      //   // Skip segments that are too small
      //   if(seg.height >= 5){
      //     textSegments.push({x: seg.x1, y: seg.y1-10, height: seg.height+15, width: seg.width});
      //   } 
      // }


      //manually set a segement to test
      let textSegments: TextSegement[] = [];
      var segments = [{x1: 1950, y1: 920, width: 800, height: 100}];
      textSegments = [{x: 1950, y: 920, width: 800, height: 100}];
      

      //draw segments on the image to debug
      drawSegments(segments, imageRoad);
      imageRoad.draw(canvas1);
      console.log(textSegments);


      //Do OCR for these Text Segements
      console.log("Do OCR with Segments:")
      await doOCR(textSegments);


      // Do OCR on the whole picture
      //console.log("\n\n\n\n\n\n Do OCR without Segments");
      //await doOCRWithoutTextDetection();
    } 

    function drawSegments(segments, image){ 
      for(var i in segments){ 
        var seg = segments[i];
        // Skip segments that are too small
        if(seg.height >= 5){ 
          image.drawRect(seg.x1, seg.y1-10, seg.width, seg.height+15, 0xFFFF0000); 
          image.drawRect(seg.x1+1, seg.y1-4, seg.width-2, seg.height+8, 0xFFFF0000);
          console.log("draw")
        } 
      } 
    }

    async function doOCR(textSegments: TextSegement[]) {
      const worker = createWorker({
        logger: m => console.log(m),
        workerPath: 'tesseractjs/worker.min.js', 
        langPath: 'assets/langData/', 
        corePath: 'tesseractjscore/tesseract-core.wasm.js'
      });
      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      await worker.setParameters({
        preserve_interword_spaces: "1", 
        //tessedit_char_whitelist: '0123456789',
        //tessedit_pageseg_mode: PSM.SINGLE_WORD
      });

      console.log("Looking in " + textSegments.length + " TextSegements")
      for(let segment of textSegments){
        const { data: { text } } = await worker.recognize(imageUrl, {
          rectangle: { top: segment.y, left: segment.x, width: segment.width, height: segment.height }
        });
      console.log(text);
      }
      await worker.terminate();
    }

    async function doOCRWithoutTextDetection() {
      const worker = createWorker({
        logger: m => console.log(m),
        workerPath: 'tesseractjs/worker.min.js', 
        langPath: 'assets/langData/', 
        corePath: 'tesseractjscore/tesseract-core.wasm.js'
      });
      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');

      const { data: { text } } = await worker.recognize(imageUrl);
      console.log(text);
      await worker.terminate();
    }
    
    
  }



  

}
