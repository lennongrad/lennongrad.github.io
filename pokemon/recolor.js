var url = 'pokemon/1.png';
var img = new Image();
img.src = url + '?' + new Date().getTime();
img.setAttribute('crossOrigin', '');

var c=document.getElementById("canvas");
var ctx=c.getContext("2d");
ctx.drawImage(img,0,0);
img.crossOrigin = "Anonymous";
img.onload = function(){
    var imgData=ctx.getImageData(0,0,c.width,c.height);
    // invert colors
    for (var i=0;i<imgData.data.length;i+=4)
      {
      imgData.data[i]=255-imgData.data[i];
      imgData.data[i+1]=255-imgData.data[i+1];
      imgData.data[i+2]=255-imgData.data[i+2];
      imgData.data[i+3]=255;
      }
    ctx.putImageData(imgData,0,0);
}
