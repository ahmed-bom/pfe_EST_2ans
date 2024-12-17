import numpy as np
import cv2
import random
class maze_generate():
    def __init__(self) -> None:
        pass
    def DFS(self,map_dim:int):
        # Create a grid filled with walls
        maze = np.ones((map_dim, map_dim),dtype=int)
        # Define the random starting point
        sid_x =random.randint(1,int(map_dim/2))-1
        sid_y =random.randint(1,int(map_dim/2))-1
        start_x=sid_x*2 + 1
        start_y=sid_y*2 + 1
        maze[start_x, start_y] = 0
        # Initialize the stack with the starting point
        stack = [(start_x, start_y)]
        count = 0
        max_p = 0
        while len(stack) > 0:
            x, y = stack[-1]
            # Define possible directions
            directions = [(0, 2), (2, 0), (0, -2), (-2, 0)]
            random.shuffle(directions)

            for dx, dy in directions:
                
                nx, ny = x + dx, y + dy
                px,py = int(x + dx/2),int(y +dy/2)
                if nx > 0 and ny > 0 and nx < map_dim and ny < map_dim and maze[nx, ny] == 1:
                    maze[nx, ny] = 0
                    maze[px,py] = 0
                    count += 1
                    # for longest path
                    if max_p < count :
                        max_p = count
                        end_x,end_y = nx,ny
                    stack.append((nx, ny))
                    break
            else:
                count -= 1
                stack.pop()

        # END
        maze[start_x,start_y] = 4
        maze[end_x, end_y] = 5
        return maze
    def from_img(image_path, threshold=128, scale_factor=1):
        img = cv2.imread("test.jpg", cv2.IMREAD_GRAYSCALE)
        # mack 2d array for the img 
        binary_img = np.where(img<threshold,1,0)
        height, width = binary_img.shape


           

        # binary img * scale factor
        if scale_factor != 1:

            new_height, new_width = int(height * scale_factor), int(width * scale_factor)
            resized_img = np.zeros((new_height, new_width))

            for i in range(new_height):
             for j in range(new_width):

                start_i = i*scale_factor
                start_j = j*scale_factor
                end_i = start_i + scale_factor
                end_j = start_j + scale_factor

                resized_img[i, j] = np.mean(binary_img[start_i:end_i,start_j:end_j])
                    # mean(binary img (fro (stare i ,stare j) to (end i ,end j)))    

            return resized_img
        else:
            return binary_img







