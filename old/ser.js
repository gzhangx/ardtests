
const data = Buffer.from([0,0, 0,0x2, 0xE5, 0x6F, 0xBD, 0x79, 0, 0, 0xa0, 0x0f, 0x00,0x7d]);
    function getAngle(data, start) {
        return ((data[start] | (data[start+1] << 8))/128)*Math.PI/180;
    }
    const fsa = getAngle(data, 4);
    const lsa = getAngle(data, 6);
    const lsn = data[3] - 1;
    console.log(`${lsn} fs ${fsa} lsa ${lsa}`);
    function getLen(start) {
        const dstart = 10;
        return (data[start+dstart] | (data[start+dstart+1] <<8))>>2;
    }
    const lenFsa = getLen(0);
    const lenLsa = getLen(lsn*2);
    const anglefsa = fsa + calculateCorr(lenFsa);
    const anglelsa = lsa + calculateCorr(lenLsa);
    const diffAng = (anglelsa - anglefsa);
    console.log(data);
    console.log(`Angle fsa ${anglefsa*180/Math.PI} ${anglelsa*180/Math.PI} diff=${diffAng*180/Math.PI}`);



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

function toHex(n) {
    return Buffer.from([n]).toString('hex');
}
port.on('data', function (data) {
  //console.log('Data:', data);
  //console.log('len=' +data.length);
  if (data[0] === 0xaa && data[1] === 0x55) {
      function getAngle(data, start) {
          return ((data[start] | (data[start+1] << 8))/128)*Math.PI/180;
      }
     const fsa = getAngle(data, 4);
     const lsa = getAngle(data, 6);
     const lsn = data[3] - 1;
     if (lsn === 0) {
         console.log('warning, 0 lsn!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1');
         console.log(data);
         return;
     }
     console.log(`${lsn} fs ${fsa} lsa ${lsa}`);
     function getLen(start) {
         const dstart = 10;
         return (data[start+dstart] | (data[start+dstart+1] <<8))>>2;
     }
     const lenFsa = getLen(0);
     const lenLsa = getLen(lsn*2);
     const anglefsa = fsa + calculateCorr(lenFsa);
     const anglelsa = lsa + calculateCorr(lenLsa);
     const diffAng = (anglelsa - anglefsa);
     //console.log(data);
     //console.log(`Angle fsa ${anglefsa*180/Math.PI} ${anglelsa*180/Math.PI}`);
     for (let i = 0; i <= lsn;i++) {
         const len = getLen(i*2);
         //console.log(`data ${toHex(data[i*2+dstart])} ${toHex(data[i*2+1+dstart])} len=${len} `);
         const ai = (diffAng/lsn*i) + anglefsa + calculateCorr(len);
         //console.log(`len=${len} ang=${ai*180/Math.PI}`);
         const x = Math.cos(ai)*len;
         const y = Math.sin(ai)*len;

         if (len != 0)
         fs.appendFile('data.txt',`${x},${y}\r\n`,err=>{
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
   //await serWrite(Buffer.from([0xA5,0x65]));
   console.log('done');  
}

test();