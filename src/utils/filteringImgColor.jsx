 export const filteringImgColor = (value, color) => {

   let stringChar =  value.map(a =>
      a.image_path.substring(
        a.image_path.lastIndexOf("-") + 1
      ).replaceAll("%20", " ")
       .slice(0, -5)
    ).filter(a => a === color);

   let findIndex =  
   value.filter(a => `${a.public_id.substring(
    a.public_id.lastIndexOf("-") + 1)}` === 
    `${stringChar}`)

   return findIndex.map(a => a.image_path);
}
