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
    let [integerPart, fractionPart] = num.toString().split('.');

    result += convertIntegerToThaiText(integerPart);

    if (fractionPart && parseInt(fractionPart) !== 0) {
        result += 'บาท' + convertFractionToThaiText(fractionPart);
    } else {
        result += 'บาทถ้วน';
    }

    return result;
}

function convertIntegerToThaiText(numStr) {
    let result = '';
    const len = numStr.length;

    for (let i = 0; i < len; i++) {
        const digit = parseInt(numStr[i]);
        const placeValue = len - i - 1;

        if (digit === 0) continue;

        if (placeValue === 1 && digit === 1) {
            result += 'สิบ';
        } else if (placeValue === 1 && digit === 2) {
            result += 'ยี่สิบ';
        } else if (placeValue === 1 && digit === 0) {
            // Skip 'zero' in the tens place
            continue;
        } else {
            result += thaiNumbers[digit];
            result += thaiUnits[placeValue % 6];
        }

        if (placeValue === 0 && digit === 1 && len > 1 && result[result.length - 1] !== 'สิบ') {
            result = result.slice(0, -thaiNumbers[1].length) + 'เอ็ด';
        }
    }

    return result;
}

function convertFractionToThaiText(fractionStr) {
    let result = '';
    const len = fractionStr.length;

    for (let i = 0; i < len; i++) {
        const digit = parseInt(fractionStr[i]);
        const placeValue = len - i - 1;

        if (digit === 0) continue;

        if (placeValue === 1 && digit === 1) {
            result += 'สิบ';
        } else if (placeValue === 1 && digit === 2) {
            result += 'ยี่สิบ';
        } else {
            result += thaiNumbers[digit];
            if (placeValue > 0) result += thaiUnits[placeValue % 6];
        }

        if (placeValue === 0 && digit === 1 && len > 1 && result[result.length - 1] !== 'สิบ') {
            result = result.slice(0, -thaiNumbers[1].length) + 'เอ็ด';
        }
    }

    return result + 'สตางค์';
}

export default numberToThaiText;
