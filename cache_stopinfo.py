#!/usr/bin/python
# Written on Saturday,  6 June 2015 by Katherine Vedder

import requests
import codecs
import sys
import re
import os
from lxml import html, etree
sys.stdout = codecs.getwriter('utf8')(sys.stdout)
sys.stderr = codecs.getwriter('utf8')(sys.stderr)


ERR_MSG = "Sorry, we don't have any information for this stop at this time, or the stop number is invalid."
spaces = re.compile(r'\s+')


def main(root='http://stopinfo.pugetsound.onebusaway.org/busstops/1_', out_dir='stopinfo_files', last_parsed=1):
    for i in range(last_parsed-1, 99999):
        url = '{}{}'.format(root, i)
        r = requests.get(url)
        text = r.text
        if len(text) < 2000:
            continue

        outfile = open(os.path.join(out_dir, "{}.xml".format(i)), 'w')
        print outfile.name
        tree = html.fromstring(text)
        tds = [x.replace('*', '').strip() for x in tree.xpath('//td/text()')]
        tds = [spaces.sub(' ', x) for x in tds if x]
        out_root = etree.Element('root')
        prev_is_infotype = False
        this_info = etree.SubElement(out_root, 'info')
        for td in tds:
            if td.endswith(':'):
                prev_is_infotype = True
                info_name = etree.SubElement(this_info, 'name')
                info_name.text = td
            else:
                if prev_is_infotype:
                    info_val = etree.SubElement(this_info, 'value')
                    info_val.text = td
                    this_info = etree.SubElement(out_root, 'info')
                prev_is_infotype = False
        print >> outfile, etree.tostring(out_root, pretty_print=True)


def get_existing(out_dir='stopinfo_files'):
    fis = [int(fi.replace('.xml', '')) for fi in os.listdir(out_dir)]
    top = sorted(fis)[-1]
    return top


if __name__ == '__main__':
    top = get_existing()
    main(last_parsed=top)
