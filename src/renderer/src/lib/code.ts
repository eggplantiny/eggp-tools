export function euclideanDistance(color1: number[], color2: number[]): number {
  return Math.sqrt(
    (color1[0] - color2[0]) ** 2
    + (color1[1] - color2[1]) ** 2
    + (color1[2] - color2[2]) ** 2,
  )
}

export function calculateCentroid(cluster: number[][]): number[] {
  const sum = cluster.reduce(
    (acc, color) => [acc[0] + color[0], acc[1] + color[1], acc[2] + color[2]],
    [0, 0, 0],
  )
  return [sum[0] / cluster.length, sum[1] / cluster.length, sum[2] / cluster.length]
}
