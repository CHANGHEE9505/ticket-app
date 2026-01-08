module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  name = "${var.cluster_name}-vpc"
  cidr = var.vpc_cidr

  azs             = ["${var.region}a", "${var.region}c"] # 가용영역 A, C 사용
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]       # 워커노드용
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]   # 로드밸런서용

  enable_nat_gateway = true
  single_nat_gateway = true  # 비용 절감 (원래는 false가 운영 원칙)
  enable_dns_hostnames = true

  # EKS가 로드밸런서를 배치할 때 필요한 태그 (필수)
  public_subnet_tags = {
    "kubernetes.io/role/elb" = 1
  }

  private_subnet_tags = {
    "kubernetes.io/role/internal-elb" = 1
  }
}