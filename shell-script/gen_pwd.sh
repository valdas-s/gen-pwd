#!/bin/bash
stty -echo
read -p "Password: " passw; echo
stty echo
str=$(echo $1:$passw | openssl dgst -rmd160 | openssl enc -base64)
len=${2:-"64"}
echo $str $len |  awk '{ print substr($1,1,$2)}'
