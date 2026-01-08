variable "region" {
  description = "AWS 리전 (서울)"
  default     = "ap-northeast-2"
}

variable "cluster_name" {
  description = "EKS 클러스터 이름"
  default     = "ticket-cluster"
}

variable "vpc_cidr" {
  description = "VPC 네트워크 대역"
  default     = "10.0.0.0/16"
}