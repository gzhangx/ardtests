console.log(calculateCorr([0xe8,0x03],0,0)/Math.PI*180)
console.log(21.8*(155.3-1000)/(155.3*1000))
return;

const SerialPort = require('serialport');
const port = new SerialPort('com3', {
  baudRate: 128000 
});



// Open errors will be emitted as an error event
port.on('error', function(err) {
  console.log('Error: ', err.message);
})

function calculateCorr(data, i, off) {
    const at = off+(i*2);
    const dist = data[at] | (data[at+1] << 8);
    console.log("dist=" + dist);
    const corr = Math.atan(21.8*(155.3-dist)/(155.3*dist));
    return corr;
}
port.on('data', function (data) {
  //console.log('Data:', data);
  //console.log('len=' +data.length);
  if (data[0] === 0xaa && data[1] === 0x55) {
     const fsa = (data[4] | (data[5] << 8))/128;
     const lsa = (data[6] | (data[7] << 8))/128;
     const lsn = data[3];
     console.log(`${lsn} fs ${fsa} lsa ${lsa}`);
     for (let i = 0; i < lsn;i++) {
         const len = data[i*2] | (data[i*2+1] <<8);

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