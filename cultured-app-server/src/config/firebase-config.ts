import admin, { ServiceAccount} from 'firebase-admin';

let serviceAccount;

if (process.env.NODE_ENV=="production") {
  serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT as string);
}else{
  serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_DEV as string);
}

if(!admin.apps.length){
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
    storageBucket: 'umeed-cultured-app.appspot.com'
  })

}


export default admin