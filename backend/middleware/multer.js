
import multer from 'multer';
//frontend se aayi image ko Backend ( Node.js + Express.js ) में image receive करने के लिए middleware use करते हैं. sabse common hai multer

const storage= multer.memoryStorage();  //👉 Memory storage = file RAM में buffer के रूप में आती है, disk पर save नहीं होती.. 

//single upload //for profile upload..that time upload only single image

export const singleUpload = multer({storage}).single("file")// aa middleware chhe to req.file ma have aa multer je temporary memory storage ma image hoy teno data aape badho ane te data aapne cloudinary ma upload karti vakhte use karvi..te data jova mate controller na logic ma req.file karvu

//multiple upload up to five images //adding product, we have more than one images of products so when use this function                                                      

export const multipleUpload = multer({storage}).array("files",5); 
 //jya pan multipleUpload no use karine file upload karo chho means..je pan route ma aane middleware aapo to je file aapo teni field "files" hovi joie... name match thavuy joie...jo postman ma test karta hov to multipart/formdata select karine pachhi key ma files aapvu name and value ma image select karvi ..

//note: jyare pan jo mota video upload karo to e pan aavi rite to first ram ma jay e ..jo 200,300 mb no video hoy to crashed thay system..to pachhi tame direct wihtout multer pan video, photo badhu upload kari shako chho....ane te upload pachhi je url aave tene db ma store... pan aanathi je multer controller aape e no male.. like file type, file size, custom logic, watermark add, compress(aa badha kam mate externel library aave..multer pasethi image library ja jay.. ketali website ma badha product upar watermark ke company nu lable bydefault aave e aavi rite aavtu hoy) aa badhu no thay direct upload thi...


 