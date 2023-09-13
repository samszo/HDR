## How-to

> on peut lister ici les différentes actions effectuées 

### Conversion odt to markdown


        pandoc -s -f odt -t markdown --wrap=none  HDR.odt  -o HDR.md

J'ai utilisé l'option `wrap=none` mais si tu préfères tu peux relancer la commande.

Problèmes identifiés à partir du markdown "raw" :
1. Les références sont embarquées dans une forme type JSON. Je pense qu'il faudra nettoyer cela avec des regex et reprendre avec une syntaxe classique : Citton considère que tout est beau [@citton_beau_2005]. 
2. les références internes indiquent des numéros de pages qui seront obsolètes. Les ancres internes par contre sont bien présentes, mais elles risquent de polluer le traitement par Quarto par exemple. On verra comment les traiter pour rationaliser. 

### Regex pour les citations

1. remplacer `\[\]\{#ZOTERO_ITEM.*?csl-citation.json"\}\s\w*\}\(([^\)]*)\)`
2. par `($1)`
3. puis remettre à la main la clé bibtex correspondante.

Mais je propose d'affiner la regex au cas où on peut extraire l'id zotero et reconstruire directement la clé bibtex.

à suivre.