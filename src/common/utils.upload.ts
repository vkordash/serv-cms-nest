
import path from 'path';
import fs from 'fs';

export function transliterate(text: string): string {
  const map: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
    'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
    'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
    'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch',
    'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya', 'Є': 'E', 'є': 'e','Ї': 'I','ї': 'i',
  };

  return text
    .split('')
    .map((char) => map[char] || char)
    .join('');
}


export function createUploadPath () {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0'); // Добавляем 0 перед цифрами 1-9
  const uploadPath = path.join('./web_docs', year.toString(), month);
  const lnkPath = path.join('./uploads', year.toString(), month);

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true }); // Создаём каталоги, если их нет
  }

  if (!fs.existsSync(lnkPath)) {
    fs.mkdirSync(lnkPath, { recursive: true }); // Создаём каталоги, если их нет
  }

  return uploadPath;
};