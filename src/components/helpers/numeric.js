export function is_numeric(val){
    return /^-?\d+(\.\d+)?$/.test(val + '');
}
