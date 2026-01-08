module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = var.cluster_name
  cluster_version = "1.30" # 쿠버네티스 버전

  # 클러스터 접근 권한 설정
  cluster_endpoint_public_access = true
  enable_cluster_creator_admin_permissions = true

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  # 워커 노드 그룹 (실제 서버)
  eks_managed_node_groups = {
    general = {
      min_size     = 2
      max_size     = 5
      desired_size = 4

      instance_types = ["t3.micro"]
      capacity_type  = "ON_DEMAND"
    }
  }
}