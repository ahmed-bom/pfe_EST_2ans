import random
class maze_solving():
    def __init__(self) -> None:
        pass
    def DBF(self,maze,start):
        all_path=[]
        visited=set()
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        dim = len( maze )
        # Initialize the stack with the starting point
        stack = [start]
        while len(stack) > 0:
            x, y = stack[-1]
            if (x,y) not in visited :
                all_path.append((x,y))
            visited.add((x,y))
            if maze[x][y]== 2:
                return (all_path,stack)
            
            # shuffle possible directions
            random.shuffle(directions)
            for dx, dy in directions:
                nx, ny = x + dx, y + dy
                if nx >= 0 and ny >= 0 and nx < dim and ny < dim and maze[nx][ny] != 1 and (nx,ny) not in visited:
                    stack.append((nx, ny))
                    break
            else:
                stack.pop()
        return all_path , "solution not find"
            # all_path // stack == solution


