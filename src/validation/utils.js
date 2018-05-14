export function checkRules(rules, value) {
    for(let rule of rules) {
        if (rule(value) === false) return false;
    }
    return true;
}