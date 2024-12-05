import random
class maze_solving():
    def __init__(self) -> None:
        pass
    def DFS(self, maze, start):

        steps_to_get_solution = []
        visited = set()
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        dim = len(maze)
        stack = [start]

        while stack:
            x, y = stack[-1]

            if (x, y) not in visited:
                steps_to_get_solution.append((x, y))

            visited.add((x, y))
            if maze[x][y] == 5:
                return steps_to_get_solution, stack
            
            random.shuffle(directions)
            for dx, dy in directions:
                nx, ny = x + dx, y + dy
                if (0 <= nx < dim and 0 <= ny < dim and
                        maze[nx][ny] != 1 and (nx, ny) not in visited):
                    stack.append((nx, ny))
                    break
            else:
                stack.pop()
                
        return steps_to_get_solution, []

    def A_star(self, maze, start):
        pass
                                       


