set N=02
pdflatex -job-name=handout%N% \def\HO{1} \input{lecture%N%}
copy handout%N%.pdf c:\www\webroot\pm1nps\courses\MAS243\lectures


