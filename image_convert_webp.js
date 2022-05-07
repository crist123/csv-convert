const sharp = require('sharp');
const fs = require('fs');

function reviewFiles(path) {
    const files = fs.readdirSync(path)
    for (const file of files) {

        if (file.includes('.svg') || file.charAt(0) == '.') continue;
        console.info("processing file: " + file)

        if (!file.includes('.')) reviewFiles(path + '/' + file)
        else {
            const data = fs.readFileSync(path + '/' + file)

            sharp(data)
                .webp()
                .toBuffer()
                .then(_file => {
                    var fileName = file.replace(/.jpg|.jpeg|.png/g, '.webp')
                    fs.writeFileSync(path + '/' + fileName, _file)
                })
        }
    }
}

reviewFiles('/Users/andresfajardo/Proyectos/biury_front/src/assets/images/components/ReviewCard');