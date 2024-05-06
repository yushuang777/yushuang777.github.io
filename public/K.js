// 计算两点之间的欧氏距离
function distance(point1, point2) {
    return Math.sqrt(point1.reduce((acc, cur, i) => acc + Math.pow(cur - point2[i], 2), 0));
}

// 分配数据点到最近的聚类中心
function assignClusters(data, centroids) {
    const clusters = new Array(centroids.length).fill().map(() => []);

    data.forEach(point => {
        const distances = centroids.map(centroid => distance(point, centroid));
        const closestCentroidIndex = distances.indexOf(Math.min(...distances));
        clusters[closestCentroidIndex].push(point);
    });

    return clusters;
}

// 更新聚类中心
function updateCentroids(clusters) {
    return clusters.map(cluster => {
        if (cluster.length > 0) {
            const centroid = cluster.reduce((acc, cur) => acc.map((val, i) => val + cur[i]), new Array(cluster[0].length).fill(0));
            return centroid.map(val => val / cluster.length);
        } else {
            return null; // 空簇返回 null
        }
    }).filter(centroid => centroid !== null); // 过滤掉空簇
}

// 判断聚类中心是否收敛
function centroidsEqual(centroids1, centroids2) {
    return JSON.stringify(centroids1) === JSON.stringify(centroids2);
}

// 执行 K-均值聚类
function kMeans(data, centroids, maxIterations) {
    let currentCentroids = centroids;

    for (let i = 0; i < maxIterations; i++) {
        const clusters = assignClusters(data, currentCentroids);
        const newCentroids = updateCentroids(clusters);

        if (centroidsEqual(currentCentroids, newCentroids)) {
            break;
        }

        currentCentroids = newCentroids;
    }

    return currentCentroids;
}

// 使用示例
const data = [[1, 2], [5, 8], [1.5, 1.8], [8, 8], [1, 0.6], [9, 11]]; // 您的数据集
const centroids = [[2, 3], [6, 7]]; // 固定的聚类中心
const maxIterations = 100; // 最大迭代次数

// 执行 K-均值聚类
const finalCentroids = kMeans(data, centroids, maxIterations);

console.log("最终聚类中心：", finalCentroids);
