#!/bin/bash

mentioned_file_list=`egrep -hro "[a-zA-Z_\.0-9]+\.(js|grxml|xml)[^a-zA-Z]" * | sort -u | sed "s/.$//g"`
actual_file_list=`ls`
mentioned_not_exist=`python -c "men=set('''$mentioned_file_list'''.split()); act=set('''$actual_file_list'''.split()); print 'MENTIONED BUT DON\'T EXIST:\n', '\n'.join(men.difference(act)); print 'EXIST BUT UNUSED:\n', '\n'.join(act.difference(men))"`
echo $mentioned_not_exist
