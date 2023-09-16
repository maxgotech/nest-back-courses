import * as bcrypt from 'bcrypt';

export const comparePasswords = async (userPassword, currentPassword) => {
    return await bcrypt.compare(currentPassword, userPassword);
};

export const Translit = async(word) =>{
    word = word.toLowerCase()
    var  a = {};
   a["ё"]="yo";a["й"]="i";a["ц"]="ts";a["у"]="u";a["к"]="k";a["е"]="e";a["н"]="n";a["г"]="g";a["ш"]="sh";a["щ"]="sch";a["з"]="z";a["х"]="h";a["ъ"]=" ";
   a["ф"]="f";a["ы"]="y";a["в"]="v";a["а"]="a";a["п"]="p";a["р"]="r";a["о"]="o";a["л"]="l";a["д"]="d";a["ж"]="zh";a["э"]="e";
   a["я"]="ya";a["ч"]="ch";a["с"]="s";a["м"]="m";a["и"]="i";a["т"]="t";a["ь"]=" ";a["б"]="b";a["ю"]="yu";a[" "]="_";a["."]="_";a[","]="_";

   return word.split('').map(function (char) { 
        return a[char] || char; 
    }).join("");
}