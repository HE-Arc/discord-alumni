/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *\
|*                         DECLARATION                         *|
\* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

interface Array<T> {
    combine(...arr: T[][]): T[][];
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *\
|*                          FUNCTIONS                          *|
\* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

Array.prototype.combine = function <T>(...arrays: T[][]): T[][] {
    const combineRecursive = (current: T[], index: number): void => {
        if (index === arrays.length) {
            result.push([...current]);
            return;
        }

        arrays[index].forEach((value) => {
            combineRecursive([...current, value], index + 1);
        });
    };

    // Add initial array to the start of the arrays
    arrays.unshift(this as T[]);

    const result: T[][] = [];
    combineRecursive([], 0);

    return result;
};
