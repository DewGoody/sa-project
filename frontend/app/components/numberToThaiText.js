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

    const numStr = num.toFixed(2);  // Ensure two decimal places
    const [integerPart, decimalPart] = numStr.split('.');

    result += convertToThaiText(parseInt(integerPart));

    if (parseInt(decimalPart) > 0) {
        result += 'บาท' + convertToThaiText(parseInt(decimalPart)) + 'สตางค์';
    } else {
        result += 'บาทถ้วน';
    }

    return result;
}

function convertToThaiText(num) {
    if (num === 0) return '';
    
    let result = '';
    const numStr = num.toString();
    const len = numStr.length;

    for (let i = 0; i < len; i++) {
        const digit = parseInt(numStr[i]);
        const placeValue = len - i - 1;

        if (digit === 0) continue;

        if (placeValue === 1 && digit === 1) {
            // Special case for numbers in the 'สิบ' range
            result += 'สิบ';
        } else if (placeValue === 1 && digit === 2) {
            // Special case for numbers like 'ยี่สิบ'
            result += 'ยี่สิบ';
        } else {
            result += thaiNumbers[digit];
            result += thaiUnits[placeValue % 6];
        }

        if (placeValue === 0 && digit === 1 && len > 1) {
            // Special case for 'เอ็ด' in numbers like 21, 31, etc.
            result = result.slice(0, -thaiNumbers[1].length) + 'เอ็ด';
        }
    }

    return result;
}

export default numberToThaiText;
