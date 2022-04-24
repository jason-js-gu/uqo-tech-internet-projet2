# Fonctionalités du projet 2 - Goupe F

## Description du projet
C'est un système de messagerie qui peut envoyer et recevoir des messages de la façon pair-à-pair.
Dans ce système, il y a trois composants: le client, le serveur et les pairs. Pour simplifier le système, on utilise l'ordinateur de l'utilisateur comme le client, le serveur et les pairs en même temps.
On va parler les fonctionalités concernant ces trois composants dans le texte suivant.

### Les fonctionalités d'un client
Un client est l'ordinateur de l'utilisateur, toutes les fonctionalités sont réalisées par le navigateur (*browser: Chrome, Safari ou Edge*) sur cet ordinateur. 
- encrypter un message
- envoyer un message encrypté
- afficher la liste de tous les messages
- décrypter un message
- afficher la liste de toutes les adresses
- chercher un message dans la liste des messages
- chercher une adresse dans la liste des adresses
- traiter des erreurs pendant l'encryption ou la décryption

### Les fonctionalités d'un serveur
Un serveur dans notre cas est le serveur web local (*localhost*) qui peut commniquer avec le client. De plus, le serveur est aussi un pair dans le réseau distribué. Il peut synchroniser aves les autres pairs.
- jouer le rôle d'un pair
- renvoyer la liste de tous les messages selon la requête du client
- recevoir un message du client et renvoyer un message
- synchroniser avec les autre pairs pour mettre à jour la liste des messages et la liste des pairs


