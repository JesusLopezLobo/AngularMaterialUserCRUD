/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// THIS CODE IS GENERATED - DO NOT MODIFY.
const u = undefined;
function plural(val) {
    const n = val, i = Math.floor(Math.abs(val)), v = val.toString().replace(/^[^.]*\.?/, '').length, f = parseInt(val.toString().replace(/^[^.]*\.?/, ''), 10) || 0;
    if (v === 0 && (i % 10 === 1 && !(i % 100 === 11)) || f % 10 === 1 && !(f % 100 === 11))
        return 1;
    if (v === 0 && (i % 10 === Math.floor(i % 10) && (i % 10 >= 2 && i % 10 <= 4) && !(i % 100 >= 12 && i % 100 <= 14)) || f % 10 === Math.floor(f % 10) && (f % 10 >= 2 && f % 10 <= 4) && !(f % 100 >= 12 && f % 100 <= 14))
        return 3;
    return 5;
}
export default ["sr-Cyrl", [["a", "p"], ["пре подне", "по подне"], u], [["пре подне", "по подне"], u, u], [["н", "п", "у", "с", "ч", "п", "с"], ["нед", "пон", "уто", "сре", "чет", "пет", "суб"], ["недеља", "понедељак", "уторак", "среда", "четвртак", "петак", "субота"], ["не", "по", "ут", "ср", "че", "пе", "су"]], u, [["ј", "ф", "м", "а", "м", "ј", "ј", "а", "с", "о", "н", "д"], ["јан", "феб", "мар", "апр", "мај", "јун", "јул", "авг", "сеп", "окт", "нов", "дец"], ["јануар", "фебруар", "март", "април", "мај", "јун", "јул", "август", "септембар", "октобар", "новембар", "децембар"]], u, [["п.н.е.", "н.е."], ["п. н. е.", "н. е."], ["пре нове ере", "нове ере"]], 1, [6, 0], ["d.M.yy.", "dd.MM.y.", "dd. MMMM y.", "EEEE, dd. MMMM y."], ["HH:mm", "HH:mm:ss", "HH:mm:ss z", "HH:mm:ss zzzz"], ["{1} {0}", u, u, u], [",", ".", ";", "%", "+", "-", "E", "×", "‰", "∞", "NaN", ":"], ["#,##0.###", "#,##0%", "#,##0.00 ¤", "#E0"], "RSD", "RSD", "Српски динар", { "AUD": [u, "$"], "BAM": ["КМ", "KM"], "GEL": [u, "ლ"], "KRW": [u, "₩"], "NZD": [u, "$"], "PHP": [u, "₱"], "TWD": ["NT$"], "USD": ["US$", "$"], "VND": [u, "₫"] }, "ltr", plural];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ItQ3lybC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbW1vbi9sb2NhbGVzL3NyLUN5cmwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsMENBQTBDO0FBQzFDLE1BQU0sQ0FBQyxHQUFHLFNBQVMsQ0FBQztBQUVwQixTQUFTLE1BQU0sQ0FBQyxHQUFXO0lBQzNCLE1BQU0sQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUVqSyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFLLEVBQUUsQ0FBQztRQUNuRixPQUFPLENBQUMsQ0FBQztJQUNiLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksRUFBRSxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksRUFBRSxDQUFDO1FBQ3JOLE9BQU8sQ0FBQyxDQUFDO0lBQ2IsT0FBTyxDQUFDLENBQUM7QUFDVCxDQUFDO0FBRUQsZUFBZSxDQUFDLFNBQVMsRUFBQyxDQUFDLENBQUMsR0FBRyxFQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsV0FBVyxFQUFDLFVBQVUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUMsVUFBVSxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLENBQUMsRUFBQyxDQUFDLEtBQUssRUFBQyxLQUFLLEVBQUMsS0FBSyxFQUFDLEtBQUssRUFBQyxLQUFLLEVBQUMsS0FBSyxFQUFDLEtBQUssQ0FBQyxFQUFDLENBQUMsUUFBUSxFQUFDLFdBQVcsRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFDLFVBQVUsRUFBQyxPQUFPLEVBQUMsUUFBUSxDQUFDLEVBQUMsQ0FBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLENBQUMsRUFBQyxDQUFDLEtBQUssRUFBQyxLQUFLLEVBQUMsS0FBSyxFQUFDLEtBQUssRUFBQyxLQUFLLEVBQUMsS0FBSyxFQUFDLEtBQUssRUFBQyxLQUFLLEVBQUMsS0FBSyxFQUFDLEtBQUssRUFBQyxLQUFLLEVBQUMsS0FBSyxDQUFDLEVBQUMsQ0FBQyxRQUFRLEVBQUMsU0FBUyxFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsS0FBSyxFQUFDLEtBQUssRUFBQyxLQUFLLEVBQUMsUUFBUSxFQUFDLFdBQVcsRUFBQyxTQUFTLEVBQUMsVUFBVSxFQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUMsTUFBTSxDQUFDLEVBQUMsQ0FBQyxVQUFVLEVBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxjQUFjLEVBQUMsVUFBVSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLEVBQUMsVUFBVSxFQUFDLGFBQWEsRUFBQyxtQkFBbUIsQ0FBQyxFQUFDLENBQUMsT0FBTyxFQUFDLFVBQVUsRUFBQyxZQUFZLEVBQUMsZUFBZSxDQUFDLEVBQUMsQ0FBQyxTQUFTLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUMsR0FBRyxDQUFDLEVBQUMsQ0FBQyxXQUFXLEVBQUMsUUFBUSxFQUFDLFlBQVksRUFBQyxLQUFLLENBQUMsRUFBQyxLQUFLLEVBQUMsS0FBSyxFQUFDLGNBQWMsRUFBQyxFQUFDLEtBQUssRUFBQyxDQUFDLENBQUMsRUFBQyxHQUFHLENBQUMsRUFBQyxLQUFLLEVBQUMsQ0FBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFDLENBQUMsQ0FBQyxFQUFDLEdBQUcsQ0FBQyxFQUFDLEtBQUssRUFBQyxDQUFDLENBQUMsRUFBQyxHQUFHLENBQUMsRUFBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDLEVBQUMsR0FBRyxDQUFDLEVBQUMsS0FBSyxFQUFDLENBQUMsQ0FBQyxFQUFDLEdBQUcsQ0FBQyxFQUFDLEtBQUssRUFBQyxDQUFDLEtBQUssQ0FBQyxFQUFDLEtBQUssRUFBQyxDQUFDLEtBQUssRUFBQyxHQUFHLENBQUMsRUFBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDLEVBQUMsR0FBRyxDQUFDLEVBQUMsRUFBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gVEhJUyBDT0RFIElTIEdFTkVSQVRFRCAtIERPIE5PVCBNT0RJRlkuXG5jb25zdCB1ID0gdW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBwbHVyYWwodmFsOiBudW1iZXIpOiBudW1iZXIge1xuY29uc3QgbiA9IHZhbCwgaSA9IE1hdGguZmxvb3IoTWF0aC5hYnModmFsKSksIHYgPSB2YWwudG9TdHJpbmcoKS5yZXBsYWNlKC9eW14uXSpcXC4/LywgJycpLmxlbmd0aCwgZiA9IHBhcnNlSW50KHZhbC50b1N0cmluZygpLnJlcGxhY2UoL15bXi5dKlxcLj8vLCAnJyksIDEwKSB8fCAwO1xuXG5pZiAodiA9PT0gMCAmJiAoaSAlIDEwID09PSAxICYmICEoaSAlIDEwMCA9PT0gMTEpKSB8fCBmICUgMTAgPT09IDEgJiYgIShmICUgMTAwID09PSAxMSkpXG4gICAgcmV0dXJuIDE7XG5pZiAodiA9PT0gMCAmJiAoaSAlIDEwID09PSBNYXRoLmZsb29yKGkgJSAxMCkgJiYgKGkgJSAxMCA+PSAyICYmIGkgJSAxMCA8PSA0KSAmJiAhKGkgJSAxMDAgPj0gMTIgJiYgaSAlIDEwMCA8PSAxNCkpIHx8IGYgJSAxMCA9PT0gTWF0aC5mbG9vcihmICUgMTApICYmIChmICUgMTAgPj0gMiAmJiBmICUgMTAgPD0gNCkgJiYgIShmICUgMTAwID49IDEyICYmIGYgJSAxMDAgPD0gMTQpKVxuICAgIHJldHVybiAzO1xucmV0dXJuIDU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFtcInNyLUN5cmxcIixbW1wiYVwiLFwicFwiXSxbXCLQv9GA0LUg0L/QvtC00L3QtVwiLFwi0L/QviDQv9C+0LTQvdC1XCJdLHVdLFtbXCLQv9GA0LUg0L/QvtC00L3QtVwiLFwi0L/QviDQv9C+0LTQvdC1XCJdLHUsdV0sW1tcItC9XCIsXCLQv1wiLFwi0YNcIixcItGBXCIsXCLRh1wiLFwi0L9cIixcItGBXCJdLFtcItC90LXQtFwiLFwi0L/QvtC9XCIsXCLRg9GC0L5cIixcItGB0YDQtVwiLFwi0YfQtdGCXCIsXCLQv9C10YJcIixcItGB0YPQsVwiXSxbXCLQvdC10LTQtdGZ0LBcIixcItC/0L7QvdC10LTQtdGZ0LDQulwiLFwi0YPRgtC+0YDQsNC6XCIsXCLRgdGA0LXQtNCwXCIsXCLRh9C10YLQstGA0YLQsNC6XCIsXCLQv9C10YLQsNC6XCIsXCLRgdGD0LHQvtGC0LBcIl0sW1wi0L3QtVwiLFwi0L/QvlwiLFwi0YPRglwiLFwi0YHRgFwiLFwi0YfQtVwiLFwi0L/QtVwiLFwi0YHRg1wiXV0sdSxbW1wi0ZhcIixcItGEXCIsXCLQvFwiLFwi0LBcIixcItC8XCIsXCLRmFwiLFwi0ZhcIixcItCwXCIsXCLRgVwiLFwi0L5cIixcItC9XCIsXCLQtFwiXSxbXCLRmNCw0L1cIixcItGE0LXQsVwiLFwi0LzQsNGAXCIsXCLQsNC/0YBcIixcItC80LDRmFwiLFwi0ZjRg9C9XCIsXCLRmNGD0LtcIixcItCw0LLQs1wiLFwi0YHQtdC/XCIsXCLQvtC60YJcIixcItC90L7QslwiLFwi0LTQtdGGXCJdLFtcItGY0LDQvdGD0LDRgFwiLFwi0YTQtdCx0YDRg9Cw0YBcIixcItC80LDRgNGCXCIsXCLQsNC/0YDQuNC7XCIsXCLQvNCw0ZhcIixcItGY0YPQvVwiLFwi0ZjRg9C7XCIsXCLQsNCy0LPRg9GB0YJcIixcItGB0LXQv9GC0LXQvNCx0LDRgFwiLFwi0L7QutGC0L7QsdCw0YBcIixcItC90L7QstC10LzQsdCw0YBcIixcItC00LXRhtC10LzQsdCw0YBcIl1dLHUsW1tcItC/LtC9LtC1LlwiLFwi0L0u0LUuXCJdLFtcItC/LiDQvS4g0LUuXCIsXCLQvS4g0LUuXCJdLFtcItC/0YDQtSDQvdC+0LLQtSDQtdGA0LVcIixcItC90L7QstC1INC10YDQtVwiXV0sMSxbNiwwXSxbXCJkLk0ueXkuXCIsXCJkZC5NTS55LlwiLFwiZGQuIE1NTU0geS5cIixcIkVFRUUsIGRkLiBNTU1NIHkuXCJdLFtcIkhIOm1tXCIsXCJISDptbTpzc1wiLFwiSEg6bW06c3MgelwiLFwiSEg6bW06c3Mgenp6elwiXSxbXCJ7MX0gezB9XCIsdSx1LHVdLFtcIixcIixcIi5cIixcIjtcIixcIiVcIixcIitcIixcIi1cIixcIkVcIixcIsOXXCIsXCLigLBcIixcIuKInlwiLFwiTmFOXCIsXCI6XCJdLFtcIiMsIyMwLiMjI1wiLFwiIywjIzAlXCIsXCIjLCMjMC4wMMKgwqRcIixcIiNFMFwiXSxcIlJTRFwiLFwiUlNEXCIsXCLQodGA0L/RgdC60Lgg0LTQuNC90LDRgFwiLHtcIkFVRFwiOlt1LFwiJFwiXSxcIkJBTVwiOltcItCa0JxcIixcIktNXCJdLFwiR0VMXCI6W3UsXCLhg5pcIl0sXCJLUldcIjpbdSxcIuKCqVwiXSxcIk5aRFwiOlt1LFwiJFwiXSxcIlBIUFwiOlt1LFwi4oKxXCJdLFwiVFdEXCI6W1wiTlQkXCJdLFwiVVNEXCI6W1wiVVMkXCIsXCIkXCJdLFwiVk5EXCI6W3UsXCLigqtcIl19LFwibHRyXCIsIHBsdXJhbF07XG4iXX0=