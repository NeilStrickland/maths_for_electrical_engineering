set N=21
pdflatex lecture%N%
copy lecture%N%.pdf c:\www\webroot\pm1nps\courses\MAS243\lectures
pdflatex -job-name=handout%N% \def\HO{1} \input{lecture%N%}
copy handout%N%.pdf c:\www\webroot\pm1nps\courses\MAS243\lectures

