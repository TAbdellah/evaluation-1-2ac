# Deux évaluations pratiques · LAB·2AC

## Utilisation

Page élèves : `https://tabdellah.github.io/evaluation-1-2ac/duo/`

Espace professeur : même adresse suivie de `#professeur`.

1. Se connecter avec le mot de passe de l’espace professeur de l’évaluation 1 existante.
2. Ouvrir **Listes XLSX** et sélectionner les fichiers des classes, jusqu’à 15 fichiers à la fois.
3. Vérifier chaque feuille : classe, colonne du nom, code élève, première ligne et colonnes des notes 1 et 2. Les feuilles sans liste peuvent être décochées.
4. Valider chaque import. Le fichier original est conservé dans un espace privé.
5. Cliquer sur **Ouvrir les évaluations**. La fermeture des nouvelles entrées laisse les copies en cours continuer.
6. Les élèves choisissent classe et groupe, puis leur nom exact dans les suggestions de la liste importée. Aucun code de classe ni code Massar ne leur est demandé. Les deux examens se suivent, 15 minutes chacun.
7. Dans **Élèves & copies**, télécharger les PDF 1 et 2 ou un ZIP des copies. Le filtre classe permet un ZIP par classe.
8. Dans **Listes XLSX**, télécharger le fichier original avec ses deux colonnes de notes remplies.

Une copie non commencée reste vide à l’export. Une copie partiellement répondue est notée sur les réponses enregistrées lorsque son temps se termine. Une copie remise ne peut plus être modifiée par l’élève.

## Contenu et barèmes

- Évaluation 1, séances 1 à 3 : information et traitement (4), composants et rôles (6), conversions (2), association de quatre composants à leur rôle (4), classement de huit images dans le système informatique (4).
- Évaluation 2, réseau local : équipements et rôles (6), topologies (3), hostname et adresse IP (3), montage câblé (3), connexion Wi-Fi du portable et de l’imprimante (2), récupération des deux fichiers et impression simulée (3).
- Chaque sujet est noté séparément sur 20. Les sujets commencés avant cette mise à jour conservent leurs exercices et leur correction d’origine.
- Les photos des exercices 1, 4 et 5 peuvent être agrandies. Les images des exercices 4 et 5 proviennent directement du cours c0. Le placement se fait par glissement ou par clic, et reste modifiable avant la remise. L’exercice 3 présente les conversions au centre de la page.
- Les images du matériel sont issues des ressources de la plateforme. La traduction arabe s’affiche au survol des consignes et des choix concernés.

## Reprise et sécurité

Le temps est contrôlé par le serveur. Une fermeture du navigateur ne remet pas le chronomètre à zéro. Sur le même navigateur, les dossiers sont conservés individuellement pour pouvoir reprendre après un changement d’élève.

Les noms exacts des élèves sont proposés après le choix de leur classe. Les codes Massar restent réservés au rapprochement des notes dans le fichier du professeur. Les notes, les classeurs et les rapports nécessitent la connexion professeur. Les réponses sont corrigées sur le serveur. Aucun corrigé complet ni mot de passe professeur n’est intégré à la page publique.

Une connexion Internet est nécessaire pour l’envoi. En cas de coupure, les modifications restent conservées sur le poste et l’application réessaie de les envoyer ; seules les réponses arrivées avant l’échéance sont prises en compte par le serveur.

## Modèle XLSX

Détection automatique des en-têtes arabes et français, dont `إسم التلميذ`, `رقم التلميذ`, `الفرض الأول`, `الفرض الثاني`. Les colonnes restent ajustables à l’import. Les classes `2APIC-1` à `2APIC-9` sont proposées sous la forme `2/1` à `2/9`.

L’export modifie uniquement les cellules de notes sélectionnées et les paramètres de recalcul. Il conserve les feuilles, textes, images, styles et cellules fusionnées du fichier d’origine. Les éventuelles formules du classeur sont recalculées à sa prochaine ouverture dans Excel.

Le modèle a été testé sur un classeur de vérification reconstitué d’après la capture. La vérification finale des colonnes se fait lors de l’import de chaque fichier réel.

Les exercices 4 et 5 validés sont proposés aux nouvelles copies (version 4). Les exercices 1 à 3 et l’évaluation 2 conservent leur contenu. Les copies déjà commencées gardent leurs réponses, leur sujet, leur chronomètre et leur correction d’origine.

## Nouvelle pratique réseau

L’exercice 4 de l’évaluation 2 suit trois étapes : relier PC-1, PC-2 et le point d’accès directement aux ports du switch ; connecter le portable et l’imprimante au Wi-Fi CLUB-2AC ; récupérer texte.txt et photos.jpg dans Documents avec Copier / Coller, puis imprimer l’affiche préparée. Chaque manipulation compte pour un point, soit 8 points.

La mission est simulée dans la page : elle ne modifie pas le réseau de l’ordinateur et n’envoie rien à une imprimante physique. Les manipulations sont sauvegardées, rejouées et corrigées sur le serveur. Les copies réseau déjà commencées conservent leur exercice et leur correction.

Les sources du nouveau module se trouvent dans source/. Le script source/build.mjs reprend le runtime antérieur à un commit vérifié et intègre uniquement le nouveau module, sa prise en charge PDF et le démarrage versionné de l’évaluation 2. Les corrigés et fichiers serveur restent dans la sauvegarde privée du professeur.
