set N=11
pdflatex probs%N%
pdflatex -job-name=sols%N% --extra-mem-bot=1000000 --extra-mem-top=1000000 \def\SOLS{1} \input{probs%N%}
copy probs%N%.pdf c:\www\webroot\pm1nps\courses\MAS243\probs
copy sols%N%.pdf c:\www\webroot\pm1nps\courses\MAS243\probs
