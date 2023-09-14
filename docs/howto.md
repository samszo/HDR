## How-to

> on peut lister ici les différentes actions effectuées 

### Conversion odt to markdown


        pandoc -s -f odt -t markdown --wrap=none  HDR.odt  -o HDR.md

J'ai utilisé l'option `wrap=none` mais si tu préfères tu peux relancer la commande.

Problèmes identifiés à partir du markdown "raw" :
1. Les références sont embarquées dans une forme type JSON. Je pense qu'il faudra nettoyer cela avec des regex et reprendre avec une syntaxe classique : Citton considère que tout est beau [@citton_beau_2005]. 
2. les références internes indiquent des numéros de pages qui seront obsolètes. Les ancres internes par contre sont bien présentes, mais elles risquent de polluer le traitement par Quarto par exemple. On verra comment les traiter pour rationaliser. 
3. les images n'ont pas été prises en compte dans cette première conversion.

### Regex pour les citations

1. remplacer `\[\]\{#ZOTERO_ITEM.*?csl-citation.json"\}\s\w*\}\(([^\)]*)\)`
2. par `($1)`
3. puis remettre à la main la clé bibtex correspondante.

Mais je propose d'affiner la regex au cas où on peut extraire l'id zotero et reconstruire directement la clé bibtex.

à suivre.

### Conversion odt → md avec images

Je recommence la conversion avec une option supplémentaire.

        pandoc -s -f odt -t markdown --extract-media=media --wrap=none  HDR.odt  -o HDR.md

Je recommence le nettoyage des guillemets et des citations.

Les images sont correctement encodées et liées avec celles du répertoire `media/`. Des marques graphiques demeurent et il sera sans doute nécessaire de leur donner un identifiant pour permettre les références internes.

On a maintenant un markdown complet à peu près correct. On pourra sans doute affiner sa préparation, mais il faut maintenant choisir la solution technique : Quarto, pandoc+scripts (Make, Bash, Python...), PageTypeToPrint ?

Car chacune de ces solutions suggérera un découpage spécifique du fichier. Il est effectivement préférable de ne pas mettre toutes les sections dans un même panier. On pourra en effet associé des données à chaque section de manière à spécifier les traitements. 

### Utilisation Quarto
 - Installation de l'application et de l'extension VSCode
 - Creation d'un projet Quarto Book dans /quarto
 - Copie /docs/HDR.md -> /quarto/HDR.qmd
 - tests :
        - Génération d'une version HTML /quarto/HDR.html : OK
        - Ajout d'une citation Zotero : OK
        - Utilisation de l'éditeur graphique : OK
