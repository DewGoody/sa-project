// utils/numberToThaiText.js
const thaiNumbers = {
    0: 'ศูนย์',
    1: 'หนึ่ง',
    2: 'สอง',
    3: 'สาม',
    4: 'สี่',
    5: 'ห้า',
    6: 'หก',
    7: 'เจ็ด',
    8: 'แปด',
    9: 'เก้า',
};

const thaiUnits = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];

function numberToThaiText(num) {
    if (num === 0) return thaiNumbers[0];

    let result = '';
    const numStr = num.toString();
    const len = numStr.length;

    for (let i = 0; i < len; i++) {
        const digit = parseInt(numStr[i]);
        const placeValue = len - i - 1;
        if (digit === 0) continue;

        if (placeValue > 0 && digit === 1 && placeValue % 6 === 1) {
            result += (placeValue % 6 === 0 ? thaiNumbers[1] : 'เอ็ด');
        } else if (placeValue % 6 === 1 && digit === 2) {
            result += 'ยี่';
        } else {
            result += thaiNumbers[digit];
        }

        result += thaiUnits[placeValue % 6];
    }

    return result;
}

export default numberToThaiText;
