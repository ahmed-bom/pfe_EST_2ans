import numpy as np
import random

def generate_maze(map_dim:int):
        # Create a grid filled with walls
        maze = np.ones((map_dim, map_dim),dtype=int)
        # Define the random starting point
        sid_x =random.randint(1,int(map_dim/2))-1
        sid_y =random.randint(1,int(map_dim/2))-1
        # make start point in (2k + 1) grid
        start_x = sid_x*2 + 1
        start_y = sid_y*2 + 1
        maze[start_x, start_y] = 2
        # Initialize the stack with the starting point
        stack = [(start_x, start_y)]
        # Define the end point
        count = 0
        max_p = 0
        
        while len(stack) > 0:
            x, y = stack[-1]
            # Define possible directions
            directions = [(0, 2), (2, 0), (0, -2), (-2, 0)]
            random.shuffle(directions)
            # Try to move in each of the 4 direction
            for dx, dy in directions:
                # next position
                nx, ny = x + dx, y + dy
                # path from current to next
                px,py = int(x + dx/2),int(y +dy/2)
                # Check if the next position is valid
                if nx > 0 and ny > 0 and nx < map_dim and ny < map_dim and maze[nx, ny] == 1:
                    maze[nx, ny] = 0
                    maze[px,py] = 0
                    count += 1
                    # check for longest path
                    if max_p < count :
                        max_p = count
                        end_x,end_y = nx,ny
                    # Add the next position to the stack
                    stack.append((nx, ny))
                    break
            else:
                # If all directions are blocked
                # Backtrack
                count -= 1
                stack.pop()

        # Set the start and end points
        maze[end_x, end_y] = 2
        start = (start_x, start_y)
        end = (end_x, end_y)
        return maze, start, end
    
def add_points(maze, number_of_points = 7):
        limit_i,limit_j = maze.shape[0]-1,maze.shape[1]-1
        counter = 0
        points = {}
        # calculate distance 
        # may be change  am note chore if it wrong
        distance = ((maze.shape[0]-2)*(maze.shape[1]-2) / (number_of_points*2))
        
        for i in range(1,limit_i):
            for j in range(1,limit_j):
                if maze[i][j] == 0 :
                    counter += 1
                if counter > distance:
                    counter = 0
                    number_of_points -= 1
                    points[str(i)+str(j)] = [i,j]
                    if number_of_points == 0:
                         return points
        return points
def add_ports(maze,probability = 5):
        # probability of adding a port 1 / probability
        limit_i,limit_j = maze.shape[0]-1,maze.shape[1]-1
        for i in range(1,limit_i):
            for j in range(1,limit_j):
                if maze[i][j] == 1 and random.randint(0,probability) == 0:
                    if maze[i+1][j] == 1 and maze[i-1][j] == 1 and maze[i][j+1] == 0 and maze[i][j-1] == 0:
                        maze[i][j] = 0
                    if maze[i+1][j] == 0 and maze[i-1][j] == 0 and maze[i][j+1] == 1 and maze[i][j-1] == 1:
                        maze[i][j] = 0







