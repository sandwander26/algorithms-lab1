const div = (a, b) => {
    return (a - a % b) / b;
}

const generate_data_set = (M, N) => {
    const DATA_SET_NUM = process.env['DATASET'];

    let a = new Array(M);
    for (let i = 0; i < M; i++) {
        a[i] = new Array(N);
    }

    let target = 0;

    if (DATA_SET_NUM === '1') {
        for (let i = 0; i < M; i++) {
            for (let j = 0; j < N; j++) {
                a[i][j] = (Math.floor(N/M) * i + j) * 2;
            }
        }
        target = 2*N + 1;
    } else if (DATA_SET_NUM === '2') {
        for (let i = 0; i < M; i++) {
            for (let j = 0; j < N; j++) {
                a[i][j] = (Math.floor(N/M) * i * j) * 2;
            }
        }
        target = 16*N + 1;
    } else {
        throw new Error("DATASET env variable required. Try DATASET=1 npm run start")
    }
    return [target, a]
}

const bin_search_on_rows = (A, target) => {
    for (const row of A) {
        let l = 0;
        let r = row.length - 1;
        
        while (r - l > 0) {
            let m = div(r + l,2);
            if (row[m] < target) {
                l = m + 1;
            } else {
                r = m;
            }
        }

        if (row[r] === target) {
            return true
        }
    }
    return false;
};

const ladder_solve = (A, target) => {
    let i = 0;
    let j = A[0].length - 1;

    while(i < A.length && j >= 0) {
        if (A[i][j] == target) {
            return true;
        } else if (A[i][j] < target) {
            i++;
        } else {
            j--;
        }
    }
    return false;
}

const ladder_exp_solve = (A, target) => {
    const N = A.length;
    const M = A[0].length;
    
    let i = 0;
    let j = M - 1;

    while (i < N && j >= 0) {
        if (A[i][j] == target) {
            return true;
        }
        if (A[i][j] < target) {
            i++;
        } else {
            bound = 1;
            while (j - bound >= 0 && A[i][j - bound] >= target) {
                bound *= 2;
            }

            l = Math.max(0, j - bound - 1);
            r = j - div(bound,2);

            while (r - l > 1) {
                m = div(l + r, 2);
                if (A[i][m] >= target) {
                    r = m;
                } else {
                    l = m;
                }
            }

            if (A[i][r] == target) {
                return true;
            } else {
                j = r;
                i++;
            }
        }
    }
    return false;
}

const calculate_results = (x) => {
    const N = Math.pow(2, 13);
    const M = Math.pow(2, x);
    const NUMBER_OF_LAUNCHES = 100;

    process.stdout.write(M + " ");

    const [target,A] = generate_data_set(M, N);
    
    let start = 0;
    let measure_time = 0;
    let average_time = 0;
    for (let i = 0; i < NUMBER_OF_LAUNCHES; i++) {
        start = process.hrtime();
        bin_search_on_rows(A, target);
        measure_time = process.hrtime(start)[1];
        average_time += measure_time;
    }
    average_time /= NUMBER_OF_LAUNCHES;

    process.stdout.write(average_time + " ");

    average_time = 0;
    for (let i = 0; i < NUMBER_OF_LAUNCHES; i++) {
        start = process.hrtime();
        ladder_solve(A, target);
        measure_time = process.hrtime(start)[1];
        average_time += measure_time;
    }
    average_time /= NUMBER_OF_LAUNCHES;

    process.stdout.write(average_time + " ");

    average_time = 0;
    for (let i = 0; i < NUMBER_OF_LAUNCHES; i++) {
        start = process.hrtime();
        ladder_exp_solve(A, target);
        measure_time = process.hrtime(start)[1];
        average_time += measure_time;
    }
    average_time /= NUMBER_OF_LAUNCHES;

    process.stdout.write(average_time + "\n");
};

const main = () => {
    for (let x = 1; x < 14; x++) {
        calculate_results(x);
    }
};

main();
