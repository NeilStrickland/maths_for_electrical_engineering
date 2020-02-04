for %%n in (01 02 03 04 05 06 07 08 09 10 11) do (
pdflatex probs%%n
pdflatex -job-name=sols%%n --extra-mem-bot=1000000 --extra-mem-top=1000000 \def\SOLS{1} \input{probs%%n}
)

