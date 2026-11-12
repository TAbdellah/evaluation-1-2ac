import {validClubOperation,replayClubNetwork} from './network-state.js';

export const NETWORK_QUIZ_VERSION='duo-2ac-2026-11-network-v2';
// Prompts and choices are public. The answer key remains in the backend.
export const networkQuestions=[
 {id:'net2_wifi',label:'Le portable reste sans câble. Quelle connexion choisis-tu ?',ar:'يبقى المحمول بدون كابل. أي اتصال تختار؟',image:'laptop',options:[['Un câble RJ45','كابل RJ45'],['Le Wi-Fi','واي فاي'],['Une clé USB','مفتاح USB']]},
 {id:'net2_photo',label:'Quel fichier faut-il récupérer sur PC-2 ?',ar:'ما الملف الذي يجب استرجاعه من PC-2؟',image:'pc',options:[['photos.jpg','ملف الصور'],['texte.txt','ملف النص'],['affiche.pdf','ملف الملصق']]},
 {id:'net2_copy',label:'Comment réunir le texte et les photos sur le portable ?',ar:'كيف نجمع النص والصور على المحمول؟',image:'laptop',options:[['Supprimer les fichiers','حذف الملفات'],['Éteindre les deux PC','إطفاء الحاسوبين'],['Copier les fichiers par le réseau','نسخ الملفات عبر الشبكة']]},
 {id:'net2_print',label:'Pour imprimer depuis le portable, où connecter l’imprimante Wi-Fi ?',ar:'للطباعة من المحمول، بأي شبكة نربط طابعة واي فاي؟',image:'printer',options:[['À un autre réseau Wi-Fi','بشبكة واي فاي أخرى'],['Au même réseau que le portable','بنفس شبكة المحمول'],['À aucun réseau','بدون شبكة']]},
 {id:'net2_mixed',label:'Le réseau utilise des câbles et le Wi-Fi. C’est un réseau…',ar:'تستعمل الشبكة كابلات وواي فاي. إنها شبكة…',image:'ap',options:[['Uniquement filaire','سلكية فقط'],['Uniquement sans fil','لاسلكية فقط'],['Mixte','مختلطة']]}
];
export const validQuizOperation=o=>['club_cable','club_disconnect'].includes(o?.type)&&validClubOperation(o);
export const quizCableCount=operations=>Object.keys(replayClubNetwork(operations).attempted).filter(k=>['pc1','pc2','ap'].includes(k)).length;
