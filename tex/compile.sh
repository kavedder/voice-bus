#!/bin/bash

# run bibtex and pdflatex around in circles a couple times until they're (hopefully) happy

# remove all the compiled files
rm -v *.aux
rm -v *.bbl
rm -v *.blg
rm -v *.log

# set the title of the tex file to compile here
# texfile=575g.final.kvedder.tex

# textitle=`echo $texfile | sed "s/\.tex//"`

# pdflatex $texfile
# bibtex $textitle
# pdflatex $texfile
# bibtex $textitle
# pdflatex $texfile
