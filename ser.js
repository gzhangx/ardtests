
const SerialPort = require('serialport');
const fs = require('fs');
const port = new SerialPort('com3', {
  baudRate: 128000 
});



// Open errors will be emitted as an error event
port.on('error', function(err) {
  console.log('Error: ', err.message);
})

function calculateCorr(dist) {
    if (dist === 0) return 0;
    const corr = Math.atan(21.8*(155.3-dist)/(155.3*dist));
    return corr;
}
port.on('data', function (data) {
  //console.log('Data:', data);
  //console.log('len=' +data.length);
  if (data[0] === 0xaa && data[1] === 0x55) {
     const fsa = (data[4] | (data[5] << 8))/128;
     const lsa = (data[6] | (data[7] << 8))/128;
     const lsn = data[3] - 1;
     console.log(`${lsn} fs ${fsa} lsa ${lsa}`);
     const lenFsa = data[0] | (data[1] <<8);
     const anglefsa = (fsa*Math.PI/180) + calculateCorr(lenFsa);
     const diffAng = (lsa - fsa)*Math.PI/180;
     for (let i = 0; i <= lsn;i++) {
         const len = data[i*2] | (data[i*2+1] <<8);
         const ai = (diffAng/lsn*i) + anglefsa + calculateCorr(len);
         console.log(`len=${len} ang=${ai*180/Math.PI}`);
         const x = Math.cos(ai)*len;
         const y = Math.sin(ai)*len;
         fs.appendFile('data.txt',`${x} ${y}\r\n`,err=>{
             if (err)console.log(err);
         });
     }
  }
});


function sleep(ms) {
  return new Promise(resolve=>{
     setTimeout(resolve, ms);
  });
}

function serWrite(buf) {
   return new Promise((resolve,reject)=>{
      port.write(buf, function(err) {
        if (err) {
          reject(err);
          return console.log('Error on write: ', err.message);
        }        
        resolve();
      });
   });
}
async function test() {
   console.log('sleeping');
   let buf = Buffer.from([0xA5,0x90]);  
   await serWrite(buf);
   await serWrite(Buffer.from([0xA5,0x60]));
   await sleep(2000);
   await serWrite(Buffer.from([0xA5,0x65]));
   console.log('done');  
}

test();