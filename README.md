# AngularOCRTest
https://github.com/naptha/tesseract.js#tesseractjs
https://github.com/jeromewu/tesseract.js-angular-app

## Setup

You have to "npm install"

I had to do these steps additionally

npm i tesseract.js marvinj

add 
    "types": ["node"]
to tsconfig.app.json to fix error unknown type "Buffer"



## Get Tranined Language Data

https://github.com/naptha/tessdata
curl -o eng.traineddata.gz https://tessdata.projectnaptha.com/4.0.0/eng.traineddata.gz

save these compressed files under assets/langData/<lang>.traineddata.gz

## Add Pictures to test

add pictures to assets folder and set the imageUrl in app.component.ts

## Start demo

ng serve