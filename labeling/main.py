from cmath import log
from github import Github

from urllib.request import Request
from urllib.request import urlopen
from urllib.parse import quote
from time import sleep
import json
from datetime import datetime, timedelta

from secret import access_token

visit_limit_gap_s = 5
single_query_date_range = 365

languages = [
    {
        'language': 'JavaScript',
        'statement': 'console.log(*)',
        'file_extension': 'js',
    },
    {
        'language': 'Python',
        'statement': 'print(*)',
        'file_extension': 'py',
    },
    {
        'language': 'Java',
        'statement': 'System.out.print*(*)',
        'file_extension': 'java',
    },
    {
        'language': 'C',
        'statement': 'printf(*)',
        'file_extension': 'c',
    }
]


# ---------------------------------------------------------------------------- #


g = Github(access_token)


def pyGitHubSearchCode():
    for language in languages:
        today = datetime.now()
        for date in range(0, 20):
            upper_time = today.strftime('%Y-%m-%d')
            lower_time = (today - timedelta(single_query_date_range)
                          ).strftime('%Y-%m-%d')

            search_query = language['statement'] + ' created:' + lower_time + \
                '..' + upper_time + ' stars:>5' + \
                ' extension:' + language['file_extension']
            # search_query = quote(search_query)

            search_result = g.search_code(
                language['statement'], qualifiers={
                    # 'created': lower_time + '..' + upper_time,
                    'stars': '>5',
                    'extension': language['file_extension']
                })
            print('---=== new search ===---')
            print(search_query)
            sleep(visit_limit_gap_s)

            page_ind = 0

            page_result = search_result.get_page(page_ind)
            print(page_result[0])
            sleep(visit_limit_gap_s)

            while len(page_result) > 0:
                page_ind += 1
                page_result = search_result.get_page(page_ind)
                sleep(visit_limit_gap_s)
                print(len(page_result))

            today = today - timedelta(single_query_date_range)

# ---------------------------------------------------------------------------- #


def search(headers, target_content, target_language, target_stars, target_page, lower_time, upper_time):
    # query = 'https://api.github.com/search/code?q={target_content}+language:{target_language}' \
    #     '+stars:>{target_stars}+page:{target_page}+per_page:100'.format(target_content=target_content, target_language=target_language,
    #                                                                     target_stars=target_stars, target_page=target_page)
    # query = 'https://api.github.com/search/code?q={target_content}%20stars:>={target_stars}%20created:>{lower_time}%20created:<={upper_time}' \
    #     '&language={target_language}&page={target_page}&per_page=100'.format(target_content=target_content, target_language=target_language,
    #                                                                          target_stars=target_stars, target_page=target_page, lower_time=lower_time, upper_time=upper_time)
    query = 'https://api.github.com/search/code?q={target_content}%20stars:>={target_stars}' \
        '&language={target_language}&page={target_page}&per_page=3'.format(target_content=target_content, target_language=target_language,
                                                                           target_stars=target_stars, target_page=target_page, lower_time=lower_time, upper_time=upper_time)
    print(query)
    request = Request(query, headers=headers)
    response = urlopen(request).read()
    result = json.loads(response.decode())
    return result


if __name__ == '__main__':
    pyGitHubSearchCode()
    # headers = {
    #     'Authorization': 'token ' + access_token,
    #     'User-Agent': 'request',
    #     'Content-Type': 'application/json',
    #     'Accept': 'application/vnd.github.v3+json',
    # }

    # for language in languages:
    #     today = datetime.now()
    #     for date in range(10):
    #         upper_time = today.strftime('%Y-%m-%d')
    #         lower_time = (today - timedelta(single_query_date_range)
    #                       ).strftime('%Y-%m-%d')

    #         for page in range(1, 11):
    #             results = search(
    #                 headers, language['statement'], language['language'], 30, page, lower_time, upper_time)
    #             print(results.items())
    #             sleep(60)
    #         sleep(60)

    #         today = today - timedelta(single_query_date_range)
