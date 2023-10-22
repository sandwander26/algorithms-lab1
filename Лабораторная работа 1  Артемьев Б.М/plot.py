import os
import matplotlib.pyplot as plt

if __name__ == "__main__":
    plt.rcParams.update({'font.size': 14})

    CASE_NUMBER = os.getenv('CASE')

    if CASE_NUMBER == '1' or CASE_NUMBER == '2':
        file_name = ''
        if CASE_NUMBER == '1':
            file_name = './first_data_set_measures.txt'
        elif CASE_NUMBER == '2':
            file_name = './second_data_set_measures.txt'

        f = open(file_name)

        x = []
        bin_search_on_rows = []
        ladder_solve = []
        ladder_exp_solve = []

        for line in f:
            m, bin_search_result, ladder_result, ladder_exp_result = map(float, line.split())
            x.append(m)
            bin_search_on_rows.append(bin_search_result)
            ladder_solve.append(ladder_result)
            ladder_exp_solve.append(ladder_exp_result)

        plt.plot(x, bin_search_on_rows, "r-", label="bin search on rows O(M*log(N))")
        plt.plot(x, ladder_solve, "g-", label="ladder algorithm O(N + M)")
        plt.plot(x, ladder_exp_solve, "b-", label="ladder with exp search algorithm O(M*(log(N) + log(M) + 1))")
        plt.yscale('log')
        plt.xlabel("M")
        plt.ylabel("time in milliseconds")
        plt.legend(title="algorithm")
        plt.title('Сравнение алгоритмов на первых данных' if CASE_NUMBER == '1' else 'Сравнение алгоритмов на вторых данных')

        plt.show()
    elif CASE_NUMBER == '3':
        first_case_results = open('./first_data_set_measures.txt')
        second_case_results = open('./second_data_set_measures.txt')

        x = []
        ladder_exp_first = []
        ladder_exp_second = []

        for line in first_case_results:
            m, _, _, ladder_exp_time = map(float, line.split())
            x.append(m)
            ladder_exp_first.append(ladder_exp_time)

        for line in second_case_results:
            m, _, _, ladder_exp_time = map(float, line.split())
            ladder_exp_second.append(ladder_exp_time)

        ladder_exp_ratio = [ ladder_exp_first[i]/ladder_exp_second[i] for i in range(len(ladder_exp_first)) ]
        plt.plot(x, ladder_exp_ratio , "r-", label="отношение времен на разных даннх")
        plt.xlabel("M")
        plt.ylabel("отношение времени")
        plt.legend()
        plt.title("ladder_exp_gen1/ladder_exp_gen2")
        plt.xscale('log')

        plt.show()
    else:
        raise RuntimeError('Required CASE environment variable. Try to use CASE=1 python plot.py')
