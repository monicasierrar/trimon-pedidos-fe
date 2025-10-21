provider "aws" {
  region  = "us-east-1"
  profile = "trimon-admin"
}

locals {
  bucket_name = "${var.fe_subdomain}-${var.environment}"
}
# resource "aws_ecr_repository" "n8n" {
#   name = "n8n"
# }
# ACM Certificate for all subdomains



# resource "aws_route53_record" "certificate_validation" {
#   for_each = {
#     for dvo in aws_acm_certificate.wildcard.domain_validation_options : dvo.domain_name => {
#       name   = dvo.resource_record_name
#       type   = dvo.resource_record_type
#       value  = dvo.resource_record_value
#     }
#   }

#   zone_id = local.hosted_zone_id
#   name    = each.value.name
#   type    = each.value.type
#   records = [each.value.value]
#   ttl     = 60
# }

# resource "aws_acm_certificate_validation" "wildcard" {
#   certificate_arn         = aws_acm_certificate.wildcard.arn
#   validation_record_fqdns = [for record in aws_route53_record.certificate_validation : record.fqdn]

#   depends_on = [aws_route53_record.certificate_validation]
# }

resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "pedidos-vpc"
  }
}

resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index)
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "pedidos-public-subnet-${count.index + 1}"
  }
  depends_on = [aws_vpc.main]
}

resource "aws_subnet" "private" {
  count      = 2
  vpc_id     = aws_vpc.main.id
  cidr_block = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index + 2)

  tags = {
    Name = "pedidos-private-subnet-${count.index + 1}"
  }
  depends_on = [aws_vpc.main]
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "pedidos-internet-gateway"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "pedidos-public-route-table"
  }
}

resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

resource "aws_nat_gateway" "main" {
  allocation_id = aws_eip.main.id
  subnet_id     = aws_subnet.public[0].id

  tags = {
    Name = "pedidos-nat-gateway"
  }
}

resource "aws_eip" "main" {
  depends_on = [aws_internet_gateway.main]
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main.id
  }

  tags = {
    Name = "pedidos-private-route-table"
  }
}

resource "aws_route_table_association" "private" {
  count          = length(aws_subnet.private)
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private.id
}

# S3 Bucket for Static Website
# module "pedidos-fe" {
#   source      = "./modules/pedidos-fe"
#   bucket_name = local.bucket_name
#   environment = var.environment
#   domain_name = var.domain_name
#   subdomain   = var.fe_subdomain
#   hosted_zone_id = var.hosted_zone_id
# }

module "pedidos-api" {
  source          = "./modules/pedidos-be"
  environment     = var.environment
  subnets         = aws_subnet.public[*].id
  private_subnets = aws_subnet.private[*].id
  hosted_zone_id  = var.hosted_zone_id
  vpc_id          = aws_vpc.main.id
  subdomain       = var.be_subdomain
  domain_name     = var.domain_name

  # Optional: override DB defaults (username/db_name/etc) if you want
  # db_username    = "pedidosuser"
  # db_name        = "pedidosDB"
  # db_instance_class = "db.t3.micro"
}

output "vpc_id" {
  value = aws_vpc.main.id
}

output "public_subnets" {
  value = aws_subnet.public[*].id
}

output "private_subnets" {
  value = aws_subnet.private[*].id
}

data "aws_availability_zones" "available" {
  state = "available"
}


# data "aws_subnets" "filtered" {
#   filter {
#     name   = "vpc-id"
#     values = [aws_vpc.main.id]
#   }
# }

# output "filtered_subnets" {
#   value = data.aws_subnets.filtered.ids
# }
