from  generate_maze import maze_generate
import cv2
gen=maze_generate()


maze = gen.from_img("test.jpg")
print(maze)


