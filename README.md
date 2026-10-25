# Évaluation 1 · Informatique 2AC

Évaluation en français, fondée sur les séances 1 et 2, sur 20 points et limitée à 20 minutes.

## Mettre en ligne sur GitHub Pages

1. Décompressez cette archive sur votre ordinateur.
2. Ajoutez **le contenu** du dossier décompressé dans le dossier choisi de votre dépôt GitHub : `index.html`, `enseignant/`, `assets/`, `.nojekyll` et ce guide.
3. Dans le dépôt, ouvrez **Settings → Pages → Build and deployment**. Choisissez **Deploy from a branch**, puis la branche et le dossier contenant `index.html` (généralement `main` et `/ (root)`). Enregistrez.
4. Quand GitHub indique que la publication est terminée, ouvrez l’adresse affichée par GitHub Pages. La page élève est `index.html` ; l’espace professeur est dans `enseignant/`, accessible aussi depuis le lien en bas de la page élève.

Vous pouvez placer ces fichiers dans un sous-dossier du dépôt de votre cours ; les chemins des ressources sont relatifs. Le fichier `.nojekyll` doit être présent à la racine de la source publiée si vous utilisez un tel sous-dossier.

La connexion au serveur est déjà configurée pour le domaine **tabdellah.github.io**. Un autre domaine nécessite son ajout dans la liste des origines autorisées de la fonction serveur.

## Fonctionnement

- Nom complet, classe et groupe avant l’entrée. Classes disponibles : 2/1 à 2/9 ; groupes 1 et 2.
- 11 exercices, 38 réponses, quatre parties, total sur 20. La question 01 utilise deux menus ; la question 09 propose deux choix guidés.
- Photos des périphériques et des huit éléments de l’unité centrale, avec agrandissement.
- Traduction arabe de chaque consigne ou phrase traduite au survol ; elle se masque quand le pointeur quitte la phrase. Les options des listes restent en français.
- Les 20 minutes commencent à l’entrée et continuent après un rechargement. Le serveur fait respecter l’heure de fin.
- Les réponses sont sauvegardées pendant l’examen. La page de fin confirme « Copie reçue par le professeur » lorsque la réception est confirmée.
- Internet est nécessaire pour commencer, sauvegarder et remettre la copie. En cas de coupure, les réponses restent sur l’appareil ; reconnectez-le avant l’échéance. Une réponse qui n’a pas atteint le serveur avant l’heure limite ne peut pas modifier la note après cette limite.
- Le bouton « Préparer une session pour le prochain élève » remet le poste à disposition après réception. Il ne supprime pas la copie du professeur.

## Espace professeur

Le mot de passe initial est remis **dans le dossier privé séparé**. Il n’est pas présent dans cette archive publique. Il peut ensuite être changé dans l’espace professeur.

Le tableau permet de filtrer par classe et groupe, rechercher un élève, consulter toutes les tentatives et leurs réponses, exporter les résultats ou toutes les réponses en CSV, et fermer les nouvelles entrées.

Les statistiques de classe utilisent la dernière copie rendue par chaque élève identifié par son nom, sa classe et son groupe. Elles affichent la moyenne, le minimum, le maximum, la réussite à partir de 10/20, la durée moyenne et la réussite par exercice. Les copies en cours sont comptées séparément et exclues des moyennes. Fermer les entrées n’interrompt pas les examens déjà commencés.

## Hébergement

GitHub Pages héberge les pages et les images. Le traitement des réponses, la vérification du mot de passe et le calcul des notes utilisent un serveur Supabase déjà configuré. La clé publique de `assets/config.js` est prévue pour être publiée ; les droits serveur et le corrigé ne sont pas inclus dans les fichiers élèves.

Les informations d’identité saisies par l’élève identifient sa copie ; elles ne vérifient pas son identité auprès d’une liste d’inscrits. Une tentative supplémentaire reste visible dans l’historique du professeur.

## Images et polices

Les photographies des périphériques et des exemples proviennent de Wikimedia Commons ; leurs attributions figurent dans les crédits de la page et les fichiers `assets/*_credit.json`. Les composants utilisent les ressources de la séance 2 du cours fourni, avec une photographie Wikimedia Commons pour la carte Wi-Fi. L’image de SMS est une illustration créée pour l’évaluation. Manrope et Noto Sans Arabic sont incluses localement avec leur licence OFL dans `assets/OFL.txt`.
