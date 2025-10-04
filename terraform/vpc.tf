# resource "aws_vpc" "main" {
#   cidr_block           = "10.0.0.0/16"
#   enable_dns_support   = true
#   enable_dns_hostnames = true

#   tags = {
#     Name = "main-vpc"
#   }
# }

# resource "aws_subnet" "public" {
#   count = 2
#   vpc_id            = aws_vpc.main.id
#   cidr_block        = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index)
#   map_public_ip_on_launch = true

#   tags = {
#     Name = "public-subnet-${count.index + 1}"
#   }
# }

# resource "aws_subnet" "private" {
#   count = 2
#   vpc_id            = aws_vpc.main.id
#   cidr_block        = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index + 2)

#   tags = {
#     Name = "private-subnet-${count.index + 1}"
#   }
# }

